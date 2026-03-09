import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor( // เป็น constructor ของ class สำหรับรับ dependency 
    @InjectRepository(Course) //inject repository ของ entity ซึ่งก็คือ Course
    private readonly courseRepository: Repository<Course>, //private readonly คือ ใช้ได้แค่เฉพาะ class นี้ และห้ามเปลี่ยนค่า
    // courseRepository คือตัวแปรที่ใช้เก็บ repository ของ entity Course
  ) {}
  // 1.สร้างหลักสูตรใหม่
  async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(newCourse);
  }

  // 2. ดึงข้อมูลทั้งหมดมา Read
  async findAll() {
    return await this.courseRepository.find({
      relations: ['courseType'], // ดึงข้อมูลจากตาราง course_types มาโชว์ด้วย
      order: { created_at: 'DESC' }, // เอาที่เพิ่งสร้างขึ้นก่อน
    });
  }

  // 3. ดึงข้อมูลทีละ 1 รายการตาม ID (Read One)
  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['courseType'],
    });
    if (!course) {
      throw new NotFoundException(`ไม่พบหลักสูตร ID: ${id}`);
    }
    return course;
  }

  // 4. แก้ไขข้อมูล (Update)
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id); // เช็คก่อนว่ามีของไหม
    const updatedCourse = Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(updatedCourse);
  }

  // 5. ลบข้อมูล (Delete)
  async remove(id: number) {
    const course = await this.findOne(id); // เช็คก่อนว่ามีไหม
    await this.courseRepository.remove(course);
    return { message: `ลบหลักสูตร ID: ${id} เรียบร้อยแล้ว` };
  }



}
//Logic การทำงาน: ส่วนที่ไปคุยกับ Database จริงๆ เพื่อดึงข้อมูลหรือบันทึกข้อมูล

// import { Injectable } from '@nestjs/common';
// import { CreateCourseDto } from './dto/create-course.dto';
// import { UpdateCourseDto } from './dto/update-course.dto';


// @Injectable()
// export class CoursesService {
//   create(createCourseDto: CreateCourseDto) {
//     return 'This action adds a new course';
//   }

//   findAll() {
//     return `This action returns all courses`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} course`;
//   }

//   update(id: number, updateCourseDto: UpdateCourseDto) {
//     return `This action updates a #${id} course`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} course`;
//   }
// }
