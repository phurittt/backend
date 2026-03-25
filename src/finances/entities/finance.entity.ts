import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum FinanceType {
  INCOME = 'income', // รายรับ
  EXPENSE = 'expense', // รายจ่าย
}

@Entity('project_finances')
export class ProjectFinance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({
    type: 'enum',
    enum: FinanceType,
  })
  type: FinanceType; //ประเภทรายรับหรือรายจ่าย ต้องมีค่า income หรือ expense

  @Column({ type: 'decimal', precision: 12, scale: 2 }) // จำนวนเงิน
  amount: number;

  @Column({ type: 'text' }) // รายละเอียด
  description: string;

  @Column({ type: 'date' }) // วันที่
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) 
  updatedAt: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
