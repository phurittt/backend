import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Registration } from '../../registrations/entities/registration.entity';

export enum CertificateStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'certificate_code', unique: true, nullable: true })
  certificateCode: string; // generate ตอนผ่านแล้ว

  @Column({ name: 'registration_id' })
  registrationId: number;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date;

  @Column({
    type: 'enum',
    enum: CertificateStatus,
    default: CertificateStatus.PENDING,
  })
  status: CertificateStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string; // เหตุผลที่ไม่ผ่าน ฯลฯ

  @Column({ name: 'issue_count', default: 0 })
  issueCount: number;

  @Column({ name: 'certificate_image', type: 'varchar', length: 500, nullable: true })
  certificateImage: string; // URL ของรูปเทมเพลตวุฒิบัตร

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Registration)
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;
}
