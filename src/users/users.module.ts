import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // เพิ่ม
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // เพิ่ม
import { Registration } from '../registrations/entities/registration.entity'; // เพิ่ม registrations

@Module({
  imports: [TypeOrmModule.forFeature([User, Registration])], // เพิ่มบรรทัดนี้สำคัญมาก!
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
