import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('course_types')
export class CourseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  //ประเภทหลักสูตร 1 ประเภท (One) สามารถมีรายวิชาข้างในได้หลายวิชา (Many
  @OneToMany(() => Course, (course) => course.courseType)
  courses: Course[];
}
