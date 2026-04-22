import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreatePatientDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}