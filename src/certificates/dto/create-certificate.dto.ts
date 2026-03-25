import { IsInt, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { CertificateStatus } from '../entities/certificate.entity';

export class CreateCertificateDto {
  @IsNotEmpty()
  @IsInt()
  registrationId: number;

  @IsOptional()
  @IsString()
  certificateCode?: string;

  @IsOptional()
  @IsEnum(CertificateStatus)
  status?: CertificateStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  certificateImage?: string;
}
