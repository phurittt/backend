import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Lecturer } from '../lecturers/entities/lecturer.entity';
import { deleteUploadedFile } from '../shared/cloudinary';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Lecturer)
    private lecturerRepository: Repository<Lecturer>,
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    const { lecturerIds, ...projectData } = createProjectDto;

    let lecturers: Lecturer[] = [];
    if (lecturerIds && lecturerIds.length > 0) {
      lecturers = await this.lecturerRepository.findBy({ id: In(lecturerIds) });
    }

    const newProject = this.projectRepository.create({
      ...projectData,
      lecturers,
    });
    const saved = await this.projectRepository.save(newProject);

    // ดึงใหม่พร้อม relations เพื่อส่งกลับให้ครบ
    return this.findOne(saved.id);
  }

  async findAll() {
    return await this.projectRepository.find({
      relations: ['projectType', 'course', 'manager', 'lecturers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['projectType', 'course', 'manager', 'lecturers'],
    });

    if (!project) {
      throw new NotFoundException(`ไม่พบโครงการ ID: ${id}`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    const { lecturerIds, ...projectData } = updateProjectDto;

    if (lecturerIds) {
      const lecturers = await this.lecturerRepository.findBy({ id: In(lecturerIds) });
      project.lecturers = lecturers;
    }

    // ลบไฟล์รูปเดิมเมื่อมีการอัปโหลดรูปใหม่
    if (projectData.coverImage && project.coverImage && projectData.coverImage !== project.coverImage) {
      await deleteUploadedFile(project.coverImage);
    }

    // ลบความสัมพันธ์เดิมหากมีการส่ง ID ใหม่มา เพื่อให้ TypeORM ใช้ ID ในการอัปเดตแทน
    if (projectData.courseId !== undefined) delete (project as any).course;
    if (projectData.projectTypeId !== undefined) delete (project as any).projectType;
    if (projectData.managerId !== undefined) delete (project as any).manager;

    Object.assign(project, projectData);
    return await this.projectRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await deleteUploadedFile(project.coverImage);
    await this.projectRepository.remove(project);
    return { message: `ลบโครงการ ID: ${id} เรียบร้อยแล้ว` };
  }
}
