import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('project_certificate_templates')
export class ProjectCertificateTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', unique: true })
  projectId: number;

  @Column({ name: 'template_image', type: 'varchar', length: 500, nullable: true })
  templateImage: string; // URL ของรูปเทมเพลต

  @Column({ name: 'create_file', default: false })
  createFile: boolean;

  @Column({ name: 'managed_at', type: 'datetime', nullable: true })
  managedAt: Date;

  @Column({ name: 'managed_by', nullable: true })
  managedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
