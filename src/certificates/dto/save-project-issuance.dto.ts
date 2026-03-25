import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveParticipantIssuanceDto {
  @IsInt()
  registrantId: number;

  @IsIn(['passed', 'not-passed', 'pending'])
  passStatus: 'passed' | 'not-passed' | 'pending';

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class SaveProjectIssuanceDto {
  @IsBoolean()
  createFile: boolean;

  @IsOptional()
  @IsString()
  templateImage?: string; // Base64

  @IsOptional()
  @IsString()
  managedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveParticipantIssuanceDto)
  participants: SaveParticipantIssuanceDto[];
}
