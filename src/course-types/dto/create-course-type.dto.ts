import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCourseTypeDto {
  @IsNotEmpty({ message: 'กรุณาระบุชื่อประเภทหลักสูตร' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string; // รหัสย่อ เช่น IT, MGMT, SOFT
}

