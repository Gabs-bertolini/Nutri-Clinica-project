import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });

    if (!user) {
      throw new BadRequestException("Usuario informado nao existe.");
    }

    const existingPatient = await this.prisma.patient.findUnique({ where: { userId: dto.userId } });
    if (existingPatient) {
      throw new BadRequestException("Ja existe paciente para este usuario.");
    }

    return this.prisma.patient.create({
      data: {
        userId: dto.userId,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
        contact: dto.contact,
      },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!patient) {
      throw new NotFoundException("Paciente nao encontrado.");
    }

    return patient;
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.ensureExists(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        userId: dto.userId,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
        contact: dto.contact,
      },
      include: { user: true },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.patient.delete({ where: { id } });
    return { message: "Paciente removido com sucesso." };
  }

  private async ensureExists(id: string): Promise<void> {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException("Paciente nao encontrado.");
    }
  }
}