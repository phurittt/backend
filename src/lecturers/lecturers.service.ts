import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { Lecturer } from './entities/lecturer.entity';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturerRepository: Repository<Lecturer>,
  ) {}

  async create(createLecturerDto: CreateLecturerDto) {
    const newLecturer = this.lecturerRepository.create(createLecturerDto);
    return await this.lecturerRepository.save(newLecturer);
  }

  async findAll() {
    return await this.lecturerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const lecturer = await this.lecturerRepository.findOneBy({ id });
    if (!lecturer) {
      throw new NotFoundException(`ไม่พบวิทยากร ID: ${id}`);
    }
    return lecturer;
  }

  async update(id: number, updateLecturerDto: UpdateLecturerDto) {
    const lecturer = await this.findOne(id);
    const updatedLecturer = Object.assign(lecturer, updateLecturerDto);
    return await this.lecturerRepository.save(updatedLecturer);
  }

  async remove(id: number) {
    const lecturer = await this.findOne(id);
    await this.lecturerRepository.remove(lecturer);
    return { message: `ลบวิทยากร ID: ${id} เรียบร้อยแล้ว` };
  }
}
