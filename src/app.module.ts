import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CourseTypesModule } from './course-types/course-types.module';
import { CoursesModule } from './courses/courses.module';
import { ProjectTypesModule } from './project-types/project-types.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { ProjectsModule } from './projects/projects.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { CertificatesModule } from './certificates/certificates.module';
import { FinancesModule } from './finances/finances.module';
import { SlideshowsModule } from './slideshows/slideshows.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'my_app_db',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    CourseTypesModule,
    CoursesModule,
    ProjectTypesModule,
    LecturersModule,
    ProjectsModule,
    RegistrationsModule,
    CertificatesModule,
    FinancesModule,
    SlideshowsModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
