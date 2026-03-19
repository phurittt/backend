import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCourseTypeDto {
  @IsNotEmpty({ message: 'กรุณาระบุชื่อประเภทหลักสูตร' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: 'กรุณาระบุรหัสย่อประเภทหลักสูตร' })
  @IsString()
  @MaxLength(50)
  code: string; // รหัสย่อ เช่น IT, MGMT, SOFT

  @IsOptional()
  @IsString()
  //@MaxLength(1000)
  description?: string;
}
