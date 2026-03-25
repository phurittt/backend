import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';

async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const match = url.match(/\/uploads\/(.+)$/);
  if (!match) return;
  try {
    await unlink(join(process.cwd(), 'uploads', match[1]!));
  } catch {
    // File may not exist — ignore
  }
}
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { SaveProjectIssuanceDto } from './dto/save-project-issuance.dto';
import { Certificate, CertificateStatus } from './entities/certificate.entity';
import { ProjectCertificateTemplate } from './entities/project-certificate-template.entity';
import { Registration, AttendanceStatus } from '../registrations/entities/registration.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(ProjectCertificateTemplate)
    private templateRepository: Repository<ProjectCertificateTemplate>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  // ─── Basic CRUD ──────────────────────────────────────────────────────────────

  async create(createCertificateDto: CreateCertificateDto) {
    const newCertificate = this.certificateRepository.create(createCertificateDto);
    return await this.certificateRepository.save(newCertificate);
  }

  async findAll() {
    return await this.certificateRepository.find({
      relations: ['registration', 'registration.user', 'registration.project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProject(projectId: number) {
    return await this.certificateRepository.find({
      where: { registration: { projectId } },
      relations: ['registration', 'registration.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.certificateRepository.find({
      where: { registration: { userId } },
      relations: [
        'registration',
        'registration.user',
        'registration.project',
        'registration.project.course',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['registration', 'registration.user', 'registration.project'],
    });
    if (!certificate) throw new NotFoundException(`ไม่พบวุฒิบัตร ID: ${id}`);
    return certificate;
  }

  async update(id: number, updateCertificateDto: UpdateCertificateDto) {
    const certificate = await this.findOne(id);
    const updatedCertificate = Object.assign(certificate, updateCertificateDto);

    if (updateCertificateDto.status === 'passed' && !certificate.certificateCode) {
      updatedCertificate.certificateCode = `CERT-${certificate.registrationId}-${Date.now().toString().slice(-6)}`;
      updatedCertificate.issueDate = new Date();
    }

    return await this.certificateRepository.save(updatedCertificate);
  }

  async remove(id: number) {
    const certificate = await this.findOne(id);
    await this.certificateRepository.remove(certificate);
    return { message: `ลบข้อมูลวุฒิบัตร ID: ${id} เรียบร้อยแล้ว` };
  }

  // ─── Project-based Certificate Management ────────────────────────────────────

  async getProjectsSummary() {
    const projects = await this.projectRepository.find({
      relations: ['course', 'manager'],
      order: { createdAt: 'DESC' },
    });

    const result: Record<string, any>[] = [];
    for (const project of projects) {
      const registrations = await this.registrationRepository.find({
        where: { projectId: project.id },
      });

      const template = await this.templateRepository.findOne({
        where: { projectId: project.id },
      });

      const attended = registrations.filter(
        (r) => r.attendanceStatus === AttendanceStatus.ATTENDED,
      ).length;
      const notAttended = registrations.filter(
        (r) =>
          r.attendanceStatus === AttendanceStatus.MISSED ||
          r.attendanceStatus === AttendanceStatus.PENDING,
      ).length;
      const cancelled = registrations.filter(
        (r) => r.attendanceStatus === AttendanceStatus.CANCELLED,
      ).length;

      result.push({
        projectId: project.id,
        courseId: project.courseId,
        courseName: project.course?.title || '-',
        projectName: project.name,
        year: project.projectYear || '-',
        duration: project.course?.duration_hours
          ? `${project.course.duration_hours} ชั่วโมง`
          : '-',
        regisOpenDate: project.registrationStartDate,
        regisCloseDate: project.registrationEndDate,
        trainingStartDate: project.trainingStartDate,
        trainingEndDate: project.trainingEndDate,
        manager: project.manager
          ? `${project.manager.firstName} ${project.manager.lastName}`
          : '-',
        registrationFee: Number(project.registrationFee) || 0,
        totalSeats: project.capacity || 0,
        seatReserve: project.reserveCapacity || 0,
        totalRegistrations: registrations.length,
        participantSummary: { attended, notAttended, cancelled },
        managedAt: template?.managedAt || null,
        managedBy: template?.managedBy || null,
        createFile: template?.createFile || false,
        hasTemplate: !!template?.templateImage,
      });
    }
    return result;
  }

  async getProjectIssuance(projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['course', 'manager'],
    });
    if (!project) throw new NotFoundException(`ไม่พบโครงการ ID: ${projectId}`);

    const registrations = await this.registrationRepository.find({
      where: { projectId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    const template = await this.templateRepository.findOne({
      where: { projectId },
    });

    const participants: Record<string, any>[] = [];
    for (const reg of registrations) {
      const cert = await this.certificateRepository.findOne({
        where: { registrationId: reg.id },
      });

      let passStatus: 'passed' | 'not-passed' | 'pending' = 'pending';
      if (cert?.status === CertificateStatus.PASSED) passStatus = 'passed';
      else if (cert?.status === CertificateStatus.FAILED) passStatus = 'not-passed';

      participants.push({
        id: cert?.id ?? null,
        registrantId: reg.id,
        participantName: `${reg.user?.firstName || ''} ${reg.user?.lastName || ''}`.trim() || '-',
        department: reg.user?.department || '-',
        phone: reg.user?.phone || '-',
        email: reg.user?.email || '-',
        registrationDate: reg.registrationDate,
        registrationType: reg.participantType,
        attendanceStatus: reg.attendanceStatus,
        passStatus,
        remarks: cert?.remarks || '',
        issuedCount: cert?.issueCount || 0,
        certificateCode: cert?.certificateCode || null,
      });
    }

    const attended = registrations.filter(
      (r) => r.attendanceStatus === AttendanceStatus.ATTENDED,
    ).length;
    const notAttended = registrations.filter(
      (r) =>
        r.attendanceStatus === AttendanceStatus.MISSED ||
        r.attendanceStatus === AttendanceStatus.PENDING,
    ).length;
    const cancelled = registrations.filter(
      (r) => r.attendanceStatus === AttendanceStatus.CANCELLED,
    ).length;

    return {
      projectId: project.id,
      courseId: project.courseId,
      courseName: project.course?.title || '-',
      projectName: project.name,
      year: project.projectYear || '-',
      duration: project.course?.duration_hours
        ? `${project.course.duration_hours} ชั่วโมง`
        : '-',
      regisOpenDate: project.registrationStartDate,
      regisCloseDate: project.registrationEndDate,
      trainingStartDate: project.trainingStartDate,
      trainingEndDate: project.trainingEndDate,
      manager: project.manager
        ? `${project.manager.firstName} ${project.manager.lastName}`
        : '-',
      registrationFee: Number(project.registrationFee) || 0,
      totalSeats: project.capacity || 0,
      seatReserve: project.reserveCapacity || 0,
      participantSummary: { attended, notAttended, cancelled },
      managedAt: template?.managedAt ?? null,
      managedBy: template?.managedBy ?? null,
      createFile: template?.createFile ?? false,
      templateImage: template?.templateImage ?? null,
      participants,
    };
  }

  async saveProjectIssuance(projectId: number, dto: SaveProjectIssuanceDto) {
    // Verify project exists
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`ไม่พบโครงการ ID: ${projectId}`);

    // Save/update template settings
    let template = await this.templateRepository.findOne({ where: { projectId } });
    if (!template) {
      template = this.templateRepository.create({ projectId });
    }
    template.createFile = dto.createFile;
    if (dto.templateImage !== undefined) {
      // ลบไฟล์เดิมถ้ามีการเปลี่ยนรูปใหม่
      if (dto.templateImage && template.templateImage && dto.templateImage !== template.templateImage) {
        await deleteUploadedFile(template.templateImage);
      }
      template.templateImage = dto.templateImage;
    }
    template.managedAt = new Date();
    template.managedBy = dto.managedBy || 'admin';
    await this.templateRepository.save(template);

    // Bulk create/update certificate records per participant
    for (const p of dto.participants) {
      let cert = await this.certificateRepository.findOne({
        where: { registrationId: p.registrantId },
      });

      const status =
        p.passStatus === 'passed'
          ? CertificateStatus.PASSED
          : p.passStatus === 'not-passed'
            ? CertificateStatus.FAILED
            : CertificateStatus.PENDING;

      if (!cert) {
        cert = this.certificateRepository.create();
        cert.registrationId = p.registrantId;
        cert.status = status;
        cert.remarks = p.remarks || '';
        cert.certificateImage = dto.templateImage || '';
      } else {
        cert.status = status;
        cert.remarks = p.remarks || '';
        if (dto.templateImage) cert.certificateImage = dto.templateImage;
      }

      // Auto-generate code when first marked as passed
      if (status === CertificateStatus.PASSED && !cert.certificateCode) {
        cert.certificateCode = `CERT-${p.registrantId}-${Date.now().toString().slice(-6)}`;
        cert.issueDate = new Date();
        cert.issueCount = (cert.issueCount || 0) + 1;
      }

      await this.certificateRepository.save(cert);
    }

    return {
      message: 'บันทึกการออกวุฒิบัตรสำเร็จ',
      managedAt: template.managedAt,
      managedBy: template.managedBy,
    };
  }

  // ─── Public Certificate Verification ─────────────────────────────────────────

  async verifyCertificate(code: string) {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateCode: code },
      relations: [
        'registration',
        'registration.user',
        'registration.project',
        'registration.project.course',
      ],
    });

    if (!certificate || certificate.status !== CertificateStatus.PASSED) {
      throw new NotFoundException('ไม่พบวุฒิบัตรที่มีรหัสนี้');
    }

    return {
      valid: true,
      certificateCode: certificate.certificateCode,
      issueDate: certificate.issueDate,
      participantName: `${certificate.registration?.user?.firstName || ''} ${certificate.registration?.user?.lastName || ''}`.trim(),
      courseName: certificate.registration?.project?.course?.title || '-',
      projectName: certificate.registration?.project?.name || '-',
      duration: certificate.registration?.project?.course?.duration_hours
        ? `${certificate.registration.project.course.duration_hours} ชั่วโมง`
        : '-',
    };
  }
}
