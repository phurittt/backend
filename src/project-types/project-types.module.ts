import { Module } from '@nestjs/common';
import { ProjectTypesService } from './project-types.service';
import { ProjectTypesController } from './project-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './entities/project-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectType])],
  controllers: [ProjectTypesController],
  providers: [ProjectTypesService],
})
export class ProjectTypesModule {}
