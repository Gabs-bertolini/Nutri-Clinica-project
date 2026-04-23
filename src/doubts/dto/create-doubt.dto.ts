import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateDoubtDto {
  @IsString()
  title!: string;

  @IsString()
  question!: string;

  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  nutritionistId?: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}