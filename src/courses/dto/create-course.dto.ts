import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'กรุณาระบุประเภทหลักสูตร' })
  @IsInt()
  course_type_id: number;

  @IsNotEmpty({ message: 'กรุณาระบุชื่อหลักสูตร' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsInt()
  hours?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  required_knowledge?: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1], { message: 'สถานะการแสดงผลต้องเป็น 0 หรือ 1 เท่านั้น' })
  is_visible?: number;
}
