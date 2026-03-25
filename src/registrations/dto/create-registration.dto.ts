import { IsInt, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { ParticipantType, PaymentStatus, AttendanceStatus } from '../entities/registration.entity';

export class CreateRegistrationDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @IsNotEmpty()
  @IsEnum(ParticipantType)
  participantType: ParticipantType;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendanceStatus?: AttendanceStatus;

  @IsOptional()
  @IsString()
  foodRequirement?: string;
}
