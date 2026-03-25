import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
// Note: We will add Certificate relation later

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  FREE = 'free',
}

export enum AttendanceStatus {
  ATTENDED = 'attended',
  MISSED = 'missed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export enum ParticipantType {
  STUDENT = 'นิสิต',
  TEACHER = 'อาจารย์',
  STAFF = 'เจ้าหน้าที่',
  GENERAL = 'บุคคลทั่วไป',
}

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date;

  @Column({
    name: 'participant_type',
    type: 'enum',
    enum: ParticipantType,
  })
  participantType: ParticipantType;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'attendance_status',
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PENDING,
  })
  attendanceStatus: AttendanceStatus;

  @Column({ name: 'food_requirement', type: 'text', nullable: true })
  foodRequirement: string;

  @Column({ name: 'is_waiting_list', default: false })
  isWaitingList: boolean;

  @Column({ name: 'verification_token', nullable: true, unique: true })
  verificationToken: string;

  @Column({ name: 'token_expires_at', type: 'datetime', nullable: true })
  tokenExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
