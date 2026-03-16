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

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Course, (course) => course.courseType)
  courses: Course[];
}
