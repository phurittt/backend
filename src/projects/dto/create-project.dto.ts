import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsInt, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectYear: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  projectTypeId?: number;

  @IsOptional()
  @IsInt()
  courseId?: number;

  @IsOptional()
  @IsInt()
  managerId?: number;

  @IsOptional()
  @IsDateString()
  projectDurationStart?: string;

  @IsOptional()
  @IsDateString()
  projectDurationEnd?: string;

  @IsOptional()
  @IsBoolean()
  requireFoodSurvey?: boolean;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  registrationStartDate?: string;

  @IsOptional()
  @IsDateString()
  registrationEndDate?: string;

  @IsOptional()
  @IsInt()
  cancelDaysBefore?: number;

  @IsOptional()
  @IsString()
  generationNumber?: string;

  @IsOptional()
  @IsArray()
  targetAudience?: string[];

  @IsOptional()
  @IsDateString()
  trainingStartDate?: string;

  @IsOptional()
  @IsDateString()
  trainingEndDate?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsInt()
  reserveCapacity?: number;

  @IsOptional()
  @IsNumber()
  registrationFee?: number;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  lecturerRemuneration?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  lecturerIds?: number[];
}
