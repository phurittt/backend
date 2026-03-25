import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('ไม่พบชื่อผู้ใช้นี้ในระบบ');
    }
    // เปรียบเทียบ password แบบ plain text (สำหรับ dev — production ควรใช้ bcrypt)
    if (user.password !== password) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
    }
    // ไม่ส่ง password กลับไป
    const { password: _, ...result } = user;
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    // สร้าง token แบบง่าย (สำหรับ dev — production ควรใช้ JWT)
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');
    return {
      access_token: token,
      user,
    };
  }

  async getProfile(token: string) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [idStr] = decoded.split(':');
      const userId = parseInt(idStr, 10);
      if (isNaN(userId)) {
        throw new UnauthorizedException('Token ไม่ถูกต้อง');
      }
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException('ไม่พบผู้ใช้');
      }
      const { password: _, ...result } = user;
      return result;
    } catch {
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }
  }
}
