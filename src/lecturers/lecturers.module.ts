import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { Lecturer } from './entities/lecturer.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer, Project])],

  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [TypeOrmModule],
})
export class LecturersModule { }
