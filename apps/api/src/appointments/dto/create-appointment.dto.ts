import { IsArray, IsDateString, IsOptional, IsString, IsUUID, ArrayMinSize } from 'class-validator';

export class CreateAppointmentDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  serviceIds: string[];

  @IsUUID()
  staffId: string;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
