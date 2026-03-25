import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import {
  Registration,
  PaymentStatus,
  AttendanceStatus,
} from './entities/registration.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    const project = await this.projectRepository.findOne({
      where: { id: createRegistrationDto.projectId },
    });
    if (!project) {
      throw new NotFoundException(
        `ไม่พบโครงการ ID: ${createRegistrationDto.projectId}`,
      );
    }

    // Validate registration window
    const now = new Date();
    if (project.registrationStartDate && now < new Date(project.registrationStartDate)) {
      throw new BadRequestException('Registration is not available at this time');
    }
    if (project.registrationEndDate && now > new Date(project.registrationEndDate)) {
      throw new BadRequestException('Registration is not available at this time');
    }

    // Count confirmed and waiting-list registrations
    const confirmedCount = await this.registrationRepository.count({
      where: {
        projectId: createRegistrationDto.projectId,
        isWaitingList: false,
        attendanceStatus: Not(AttendanceStatus.CANCELLED),
      },
    });
    const waitingCount = await this.registrationRepository.count({
      where: {
        projectId: createRegistrationDto.projectId,
        isWaitingList: true,
        attendanceStatus: Not(AttendanceStatus.CANCELLED),
      },
    });

    const capacity = project.capacity || 0;
    const reserveCapacity = project.reserveCapacity || 0;

    let isWaitingList = false;
    if (confirmedCount >= capacity) {
      // Full — try waiting list
      if (reserveCapacity === 0 || waitingCount >= reserveCapacity) {
        throw new BadRequestException(
          'ขออภัย ที่นั่งและคิวสำรองเต็มแล้ว ไม่สามารถลงทะเบียนได้',
        );
      }
      isWaitingList = true;
    }

    const newRegistration = this.registrationRepository.create({
      ...createRegistrationDto,
      paymentStatus:
        project.registrationFee > 0
          ? PaymentStatus.UNPAID
          : PaymentStatus.FREE,
      attendanceStatus: AttendanceStatus.PENDING,
      registrationDate: new Date(),
      isWaitingList,
    });

    return await this.registrationRepository.save(newRegistration);
  }

  // ─── Cancel & Auto-promote ────────────────────────────────────────────────────

  async cancelRegistration(id: number) {
    const registration = await this.findOne(id);
    if (registration.attendanceStatus === AttendanceStatus.CANCELLED) {
      return { message: 'ยกเลิกแล้ว' };
    }

    const wasConfirmed = !registration.isWaitingList;
    const projectId = registration.projectId;

    registration.attendanceStatus = AttendanceStatus.CANCELLED;
    await this.registrationRepository.save(registration);

    // Promote the first waiting-list member when a confirmed spot opens up
    if (wasConfirmed) {
      await this.promoteFromWaiting(projectId);
    }

    return { message: 'ยกเลิกการลงทะเบียนสำเร็จ' };
  }

  private async promoteFromWaiting(projectId: number) {
    const first = await this.registrationRepository.findOne({
      where: {
        projectId,
        isWaitingList: true,
        attendanceStatus: Not(AttendanceStatus.CANCELLED),
      },
      order: { createdAt: 'ASC' },
    });
    if (!first) return;

    first.isWaitingList = false;
    await this.registrationRepository.save(first);
  }

  // ─── Read ─────────────────────────────────────────────────────────────────────

  async findAll() {
    return await this.registrationRepository.find({
      relations: ['user', 'project', 'project.course'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProject(projectId: number) {
    return await this.registrationRepository.find({
      where: { projectId },
      relations: ['user', 'project', 'project.course'],
      order: { registrationDate: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.registrationRepository.find({
      where: { userId },
      relations: ['project', 'project.course'],
      order: { registrationDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'project.course'],
    });
    if (!registration) {
      throw new NotFoundException(`ไม่พบการลงทะเบียน ID: ${id}`);
    }
    return registration;
  }

  async update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    const registration = await this.findOne(id);
    const updatedRegistration = Object.assign(registration, updateRegistrationDto);
    return await this.registrationRepository.save(updatedRegistration);
  }

  async remove(id: number) {
    const registration = await this.findOne(id);
    await this.registrationRepository.remove(registration);
    return { message: `ลบข้อมูลลงทะเบียน ID: ${id} เรียบร้อยแล้ว` };
  }

  // ─── Manual Attendance Confirmation ──────────────────────────────────────────

  async confirmAttendance(id: number) {
    const registration = await this.findOne(id);
    if (registration.attendanceStatus === AttendanceStatus.CANCELLED) {
      throw new BadRequestException('ไม่สามารถยืนยันการลงทะเบียนที่ถูกยกเลิกแล้ว');
    }
    registration.attendanceStatus = AttendanceStatus.ATTENDED;
    await this.registrationRepository.save(registration);
    return { message: 'ยืนยันการเข้าร่วมอบรมสำเร็จ' };
  }
}
