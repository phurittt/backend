import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectType } from './entities/project-type.entity';

@Injectable()
export class ProjectTypesService {
  constructor(
    @InjectRepository(ProjectType)
    private readonly projectTypeRepository: Repository<ProjectType>,
  ) {}

  // 1. สร้างประเภทโครงการใหม่
  async create(createProjectTypeDto: CreateProjectTypeDto) {
    const newType = this.projectTypeRepository.create(createProjectTypeDto);
    return await this.projectTypeRepository.save(newType);
  }

  // 2. ดึงข้อมูลประเภทโครงการทั้งหมด
  async findAll() {
    return await this.projectTypeRepository.find({
      order: { id: 'ASC' }, // เรียงตามลำดับ ID
    });
  }

  // 3. ดึงข้อมูลตาม ID
  async findOne(id: number) {
    const projectType = await this.projectTypeRepository.findOne({
      where: { id },
    });
    if (!projectType) {
      throw new NotFoundException(`ไม่พบประเภทโครงการ ID: ${id}`);
    }
    return projectType;
  }

  // 4. แก้ไขข้อมูล
  async update(id: number, updateProjectTypeDto: UpdateProjectTypeDto) {
    const projectType = await this.findOne(id);
    const updated = Object.assign(projectType, updateProjectTypeDto);
    return await this.projectTypeRepository.save(updated);
  }

  // 5. ลบข้อมูล
  async remove(id: number) {
    const projectType = await this.findOne(id);
    await this.projectTypeRepository.remove(projectType);
    return { message: `ลบประเภทโครงการ ID: ${id} เรียบร้อยแล้ว` };
  }
}
