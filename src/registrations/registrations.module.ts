import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './entities/registration.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Project])],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [TypeOrmModule],
})
export class RegistrationsModule {}
