import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // ปกติของ XAMPP คือ root
      password: '', // ปกติของ XAMPP คือว่างไว้
      database: 'my_app_db', // ชื่อ DB ที่สร้างใน Phase 1
      entities: [],
      synchronize: true, // Auto create tables (ใช้เฉพาะ Dev เท่านั้น)
      autoLoadEntities: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
