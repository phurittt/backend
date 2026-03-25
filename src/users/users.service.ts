import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // ต้อง import เพิ่ม
import { Repository } from 'typeorm'; // ต้อง import เพิ่ม
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'; // import Entity ที่เราสร้างไว้
import { Registration } from '../registrations/entities/registration.entity';

@Injectable()
export class UsersService {
  // Inject Repository เข้ามาเพื่อให้ Service คุยกับ Database ได้
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Registration) // ✅ เพิ่มอันนี้
    private registrationRepository: Repository<Registration>,
  ) { }

  // สร้าง User ใหม่
  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  // ดึงข้อมูลทั้งหมด
  findAll() {
    return this.usersRepository.find();
  }

  // ดึงข้อมูลตาม ID
  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  // ดึงข้อมูลตาม username
  findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  // ดึงข้อมูลการลงทะเบียนตาม ID
  async getUserRegistrations(userId: number) {
    return this.registrationRepository.find({
      where: { userId },
      relations: ['project'], // 🔥 ดึง project มาด้วย
    });
  }

  // แก้ไขข้อมูล
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  // ลบข้อมูล
  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
