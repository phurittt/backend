import { IsInt, IsNotEmpty, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSlideshowDto {
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  courseId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
