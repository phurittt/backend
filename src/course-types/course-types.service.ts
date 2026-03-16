import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseTypeDto } from './dto/create-course-type.dto';
import { UpdateCourseTypeDto } from './dto/update-course-type.dto';
import { CourseType } from './entities/course-type.entity';

@Injectable()
export class CourseTypesService {
  constructor(
    @InjectRepository(CourseType)
    private readonly courseTypeRepository: Repository<CourseType>,
  ) {}

  // 1. สร้างประเภทหลักสูตรใหม่
  async create(createCourseTypeDto: CreateCourseTypeDto) {
    const newCourseType = this.courseTypeRepository.create(createCourseTypeDto);
    return await this.courseTypeRepository.save(newCourseType);
  }

  // 2. ดึงประเภทหลักสูตรทั้งหมด
  async findAll() {
    return await this.courseTypeRepository.find({
      order: { id: 'ASC' },
    });
  }

  // 3. ดึงข้อมูลตาม ID
  async findOne(id: number) {
    const courseType = await this.courseTypeRepository.findOne({
      where: { id },
    });
    if (!courseType) {
      throw new NotFoundException(`ไม่พบประเภทหลักสูตร ID: ${id}`);
    }
    return courseType;
  }

  // 4. แก้ไขข้อมูล
  async update(id: number, updateCourseTypeDto: UpdateCourseTypeDto) {
    const courseType = await this.findOne(id);
    const updated = Object.assign(courseType, updateCourseTypeDto);
    return await this.courseTypeRepository.save(updated);
  }

  // 5. ลบข้อมูล
  async remove(id: number) {
    const courseType = await this.findOne(id);
    await this.courseTypeRepository.remove(courseType);
    return { message: `ลบประเภทหลักสูตร ID: ${id} เรียบร้อยแล้ว` };
  }
}
