import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateLecturerDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  expertise?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
