import { IsInt, IsNotEmpty, IsEnum, IsString, IsNumber, IsDateString } from 'class-validator';
import { FinanceType } from '../entities/finance.entity';

export class CreateFinanceDto {
  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @IsNotEmpty()
  @IsEnum(FinanceType)
  type: FinanceType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}
