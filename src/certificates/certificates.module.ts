import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate } from './entities/certificate.entity';
import { ProjectCertificateTemplate } from './entities/project-certificate-template.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, ProjectCertificateTemplate, Registration, Project])],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [TypeOrmModule],
})
export class CertificatesModule {}
