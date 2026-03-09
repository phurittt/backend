import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // เพิ่มบรรทัดนี้
import { Course } from './entities/course.entity'; // เพิ่มบรรทัดนี้
import { CourseType } from 'src/course-types/entities/course-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseType])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
//ตัวเชื่อมรวม: มัดรวม Controller, Service และ Entity เข้าด้วยกันเพื่อให้ NestJS รู้จัก
