import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ConsultationsService } from "./consultations.service";
import { CreateConsultationDto } from "./dto/create-consultation.dto";
import { UpdateConsultationDto } from "./dto/update-consultation.dto";

@UseGuards(JwtAuthGuard)
@Controller("consultations")
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  create(@Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.consultationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.consultationsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateConsultationDto) {
    return this.consultationsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.consultationsService.remove(id);
  }
}