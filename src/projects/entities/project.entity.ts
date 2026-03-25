import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ProjectType } from '../../project-types/entities/project-type.entity';
import { User } from '../../users/entities/user.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_year' })
  projectYear: string; // ปีงบประมาณ

  @Column()
  name: string; // ชื่อโครงการ

  @Column({ name: 'project_type_id', nullable: true })
  projectTypeId: number;

  @Column({ name: 'course_id', nullable: true })
  courseId: number;

  @Column({ name: 'manager_id', nullable: true })
  managerId: number;

  @Column({ name: 'project_duration_start', type: 'date', nullable: true })
  projectDurationStart: Date; // ระยะเวลาโครงการ (ตั้งแต่)

  @Column({ name: 'project_duration_end', type: 'date', nullable: true })
  projectDurationEnd: Date; // ระยะเวลาโครงการ (ถึง)

  @Column({ name: 'require_food_survey', default: false })
  requireFoodSurvey: boolean; // สถานะการสอบถามเรื่องอาหาร

  @Column({ default: true })
  status: boolean; // สถานะการเปิดอบรม (เปิด/ปิด)

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean; // การแสดงผลบนหน้าเว็ป

  @Column({ type: 'text', nullable: true })
  location: string; // สถานที่ฝึกอบรม

  @Column({ name: 'registration_start_date', type: 'datetime', nullable: true })
  registrationStartDate: Date;

  @Column({ name: 'registration_end_date', type: 'datetime', nullable: true })
  registrationEndDate: Date;

  @Column({ name: 'cancel_days_before', nullable: true })
  cancelDaysBefore: number; // ยกเลิกได้ก่อนวันก่อนอบรม

  @Column({ name: 'generation_number', nullable: true })
  generationNumber: string; // รุ่นที่

  @Column({ type: 'simple-json', name: 'target_audience', nullable: true })
  targetAudience: string[]; // กลุ่มเป้าหมาย (เก็บเป็น Array ข้อมูลเช่น ['นิสิต', 'อาจารย์'])

  @Column({ name: 'training_start_date', type: 'datetime', nullable: true })
  trainingStartDate: Date;

  @Column({ name: 'training_end_date', type: 'datetime', nullable: true })
  trainingEndDate: Date;

  @Column({ nullable: true })
  capacity: number; // จำนวนที่เปิดรับ (คน)

  @Column({ name: 'reserve_capacity', default: 0 })
  reserveCapacity: number; // จำนวนสำรอง

  @Column({
    name: 'registration_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  registrationFee: number;

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string;

  @Column({
    name: 'lecturer_remuneration',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  lecturerRemuneration: number; // ค่าตอบแทนวิทยากร

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ProjectType)
  @JoinColumn({ name: 'project_type_id' })
  projectType: ProjectType;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToMany(() => Lecturer, (lecturer) => lecturer.projects)
  @JoinTable({
    name: 'project_lecturers',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'lecturer_id', referencedColumnName: 'id' },
  })
  lecturers: Lecturer[];
}
