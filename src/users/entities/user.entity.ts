import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  PARTICIPANT = 'participant',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number; //id

  @Column({ unique: true })
  username: string; //username

  @Column()
  password?: string; // Should be hashed in real app

  @Column({ name: 'first_name' })
  firstName: string; // ชื่อ

  @Column({ name: 'last_name' })
  lastName: string; // นามสกุล

  @Column({ nullable: true })
  department?: string; // แผนก

  @Column({
    type: 'enum', // กำหนดประเภทข้อมูลเป็น enum
    enum: UserRole, // กำหนดค่าที่สามารถใส่ได้
    default: UserRole.PARTICIPANT, // ถ้าไม่ใส่จะ default เป็น participant
  })
  role: UserRole; // ตำแหน่ง

  @Column({ type: 'text', nullable: true })
  address?: string; // ที่อยู่

  @Column({ nullable: true }) // จังหวัด
  province?: string;

  @Column({ nullable: true }) // รหัสไปรษณีย์
  zipcode?: string;

  @Column({ nullable: true }) // เบอร์โทรศัพท์
  phone?: string;

  @Column({ unique: true, nullable: true }) // อีเมล
  email?: string;

  @Column({ name: 'profile_picture', type: 'varchar', length: 500, nullable: true }) // รูปโปรไฟล์
  profilePicture?: string;

  @Column({ name: 'is_active', default: true }) // สถานะ
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' }) // วันที่สร้าง
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // วันที่อัปเดต
  updatedAt: Date;
}
