import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('lecturers')
export class Lecturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ type: 'text', nullable: true })
  expertise?: string; //ความเชี่ยวชาญ

  @Column({ type: 'text', nullable: true })
  additionalInfo?: string; //ข้อมูลเพิ่มเติม

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations — inverse side ของ ManyToMany ที่อยู่ใน Project
  @ManyToMany(() => Project, (project) => project.lecturers)
  projects: Project[];
}
