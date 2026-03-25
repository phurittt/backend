import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseType } from '../../course-types/entities/course-type.entity';//import course-type

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number; //id

  @Column({ nullable: true }) // รหัสประเภทวิชา
  course_type_id: number;

  @Column() // ชื่อวิชา
  title: string;

  @Column({ type: 'text', nullable: true }) // วัตถุประสงค์
  objective: string;

  @Column({ nullable: true }) // ระยะเวลาเรียน
  duration_hours: number;

  @Column({ type: 'text', nullable: true }) // เนื้อหา
  content: string;

  @Column({ type: 'text', nullable: true }) // ความรู้พื้นฐาน
  required_knowledge: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true }) // รูปหน้าปก
  coverImage?: string;

  @Column({ type: 'tinyint', default: 1 }) // สถานะว่าเปิดแสดงหน้าเว็ปไหม
  is_visible: number;

  @CreateDateColumn({ name: 'created_at' }) // วันที่สร้าง
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // วันที่อัปเดต
  updatedAt: Date;

  @ManyToOne(() => CourseType, (courseType) => courseType.courses) // ManyToOne คือ 1 ตารางสามารถมีได้หลายตาราง
  @JoinColumn({ name: 'course_type_id' }) // เชื่อมกับตาราง course_types
  courseType: CourseType; // courseType คือตัวแปรที่ใช้เก็บข้อมูลจากตาราง course_types

  // Relation to projects will be added soon
}
