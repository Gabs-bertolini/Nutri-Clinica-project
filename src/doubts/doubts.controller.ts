import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CreateDoubtDto } from "./dto/create-doubt.dto";
import { UpdateDoubtDto } from "./dto/update-doubt.dto";
import { DoubtsService } from "./doubts.service";

@UseGuards(JwtAuthGuard)
@Controller("doubts")
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Post()
  create(@Body() dto: CreateDoubtDto) {
    return this.doubtsService.create(dto);
  }

  @Get()
  findAll() {
    return this.doubtsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.doubtsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDoubtDto) {
    return this.doubtsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.doubtsService.remove(id);
  }
}