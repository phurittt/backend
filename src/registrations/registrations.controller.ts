import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationsService.create(createRegistrationDto);
  }

  @Get()
  findAll() {
    return this.registrationsService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.registrationsService.findByProject(+projectId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.registrationsService.findByUser(+userId);
  }

  @Post(':id/confirm')
  @HttpCode(200)
  confirmAttendance(@Param('id') id: string) {
    return this.registrationsService.confirmAttendance(+id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  cancelRegistration(@Param('id') id: string) {
    return this.registrationsService.cancelRegistration(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrationDto: UpdateRegistrationDto) {
    return this.registrationsService.update(+id, updateRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationsService.remove(+id);
  }
}
