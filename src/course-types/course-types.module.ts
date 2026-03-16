import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseTypesService } from './course-types.service';
import { CourseTypesController } from './course-types.controller';
import { CourseType } from './entities/course-type.entity'; // <--- เช็คตัวนี้

@Module({
  imports: [TypeOrmModule.forFeature([CourseType])], // <--- ต้องมี CourseType ในนี้
  controllers: [CourseTypesController],
  providers: [CourseTypesService],
  exports: [TypeOrmModule], // เพิ่มบรรทัดนี้เผื่อไว้ให้ Module อื่นดึงไปใช้ได้
})
export class CourseTypesModule {}
