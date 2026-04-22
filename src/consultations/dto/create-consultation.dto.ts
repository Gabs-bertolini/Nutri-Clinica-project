import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { ConsultationStatus } from "../../common/enums/consultation-status.enum";

export class CreateConsultationDto {
  @IsString()
  patientId!: string;

  @IsString()
  nutritionistId!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsEnum(ConsultationStatus)
  status?: ConsultationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}