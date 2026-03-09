import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseTypesService } from './course-types.service';
import { CreateCourseTypeDto } from './dto/create-course-type.dto';
import { UpdateCourseTypeDto } from './dto/update-course-type.dto';

@Controller('course-types')
export class CourseTypesController {
  constructor(private readonly courseTypesService: CourseTypesService) {}

  @Post()
  create(@Body() createCourseTypeDto: CreateCourseTypeDto) {
    return this.courseTypesService.create(createCourseTypeDto);
  }

  @Get()
  findAll() {
    return this.courseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseTypeDto: UpdateCourseTypeDto) {
    return this.courseTypesService.update(+id, updateCourseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseTypesService.remove(+id);
  }
}
