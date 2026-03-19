import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseType } from './entities/course-type.entity';
import { CreateCourseTypeDto } from './dto/create-course-type.dto';
import { UpdateCourseTypeDto } from './dto/update-course-type.dto';

@Injectable()
export class CourseTypesService {
  constructor(
    @InjectRepository(CourseType)
    private readonly repository: Repository<CourseType>,
  ) {}

  async findAll() {
    const types = await this.repository.find({
      relations: ['courses'],
      order: { id: 'DESC' },
    });
    return types.map((t) => ({
      ...t,
      courseCount: t.courses?.length || 0,
    }));
  }

  //add this function
  async findOne(id: number) {
    const type = await this.repository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!type) throw new NotFoundException(`ไม่พบประเภทหลักสูตร ID: ${id}`);
    return {
      ...type,
      courseCount: type.courses?.length || 0,
    };
  }

  async create(dto: CreateCourseTypeDto) {
    const newType = this.repository.create(dto);
    return await this.repository.save(newType);
  }

  // async update(id: number, dto: CreateCourseTypeDto) {
  //   const type = await this.repository.preload({ id, ...dto });
  //   if (!type) throw new NotFoundException(`ไม่พบประเภทหลักสูตร ID: ${id}`);
  //   return await this.repository.save(type);
  // }
  async update(id: number, dto: UpdateCourseTypeDto) {
    const type = await this.repository.preload({
      id: id,
      ...dto,
    });
    if (!type) {
      throw new NotFoundException(
        `ไม่พบประเภทหลักสูตร ID: ${id} เพื่อทำการอัปเดต`,
      );
    }
    return await this.repository.save(type);
  }

  async remove(id: number) {
    const type = await this.repository.findOneBy({ id });
    if (!type) throw new NotFoundException(`ไม่พบข้อมูลที่ต้องการลบ`);
    return await this.repository.remove(type);
  }
}