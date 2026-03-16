import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateProjectTypeDto {
  @IsNotEmpty({ message: 'กรุณาระบุชื่อประเภทโครงการ' })
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1], {
    message: 'ค่าลงทะเบียนต้องเป็น 0 (ไม่มี) หรือ 1 (มี) เท่านั้น',
  })
  regis_fee?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
