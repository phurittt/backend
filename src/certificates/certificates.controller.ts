import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { SaveProjectIssuanceDto } from './dto/save-project-issuance.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // ─── Project-based management (must come before :id routes) ────────────────

  @Get('projects-summary')
  getProjectsSummary() {
    return this.certificatesService.getProjectsSummary();
  }

  @Get('project-issuance/:projectId')
  getProjectIssuance(@Param('projectId') projectId: string) {
    return this.certificatesService.getProjectIssuance(+projectId);
  }

  @Post('project-issuance/:projectId')
  saveProjectIssuance(
    @Param('projectId') projectId: string,
    @Body() dto: SaveProjectIssuanceDto,
  ) {
    return this.certificatesService.saveProjectIssuance(+projectId, dto);
  }

  @Get('verify/:code')
  verifyCertificate(@Param('code') code: string) {
    return this.certificatesService.verifyCertificate(code);
  }

  // ─── Basic CRUD ─────────────────────────────────────────────────────────────

  @Post()
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Get()
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.certificatesService.findByProject(+projectId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.certificatesService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificatesService.update(+id, updateCertificateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificatesService.remove(+id);
  }
}
