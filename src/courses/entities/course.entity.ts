import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseType } from '../../course-types/entities/course-type.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  course_type_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  objective: string;

  @Column({ nullable: true })
  duration_hours: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  required_knowledge: string;

  @Column({ type: 'tinyint', default: 1 })
  is_visible: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => CourseType, (courseType) => courseType.courses)
  @JoinColumn({ name: 'course_type_id' }) // เชื่อมกับ Column ที่เราทำ Index ไว้
  courseType: CourseType;
}
