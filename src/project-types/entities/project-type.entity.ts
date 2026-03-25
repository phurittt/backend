import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('project_types') // ต้องตรงกับชื่อตารางใน phpMyAdmin
export class ProjectType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'tinyint', default: 0 }) // ค่า default ถ้าไม่ใส่จะ default เป็น 0
  regis_fee: number; //มีค่าธรรมเนียมหรือไม่มี

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
