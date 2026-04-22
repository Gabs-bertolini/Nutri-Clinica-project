import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "../common/enums/user-role.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CreateConsultationDto } from "./dto/create-consultation.dto";
import { UpdateConsultationDto } from "./dto/update-consultation.dto";

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateConsultationDto) {
    await this.validateRelations(dto.patientId, dto.nutritionistId);

    return this.prisma.consultation.create({
      data: {
        patientId: dto.patientId,
        nutritionistId: dto.nutritionistId,
        date: new Date(dto.date),
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });
  }

  async findAll() {
    return this.prisma.consultation.findMany({
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
      orderBy: { date: "asc" },
    });
  }

  async findOne(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException("Consulta nao encontrada.");
    }

    return consultation;
  }

  async update(id: string, dto: UpdateConsultationDto) {
    await this.ensureExists(id);

    if (dto.patientId || dto.nutritionistId) {
      const current = await this.prisma.consultation.findUnique({ where: { id } });
      await this.validateRelations(dto.patientId ?? current!.patientId, dto.nutritionistId ?? current!.nutritionistId);
    }

    return this.prisma.consultation.update({
      where: { id },
      data: {
        patientId: dto.patientId,
        nutritionistId: dto.nutritionistId,
        date: dto.date ? new Date(dto.date) : undefined,
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.consultation.delete({ where: { id } });
    return { message: "Consulta removida com sucesso." };
  }

  private async ensureExists(id: string): Promise<void> {
    const consultation = await this.prisma.consultation.findUnique({ where: { id } });
    if (!consultation) {
      throw new NotFoundException("Consulta nao encontrada.");
    }
  }

  private async validateRelations(patientId: string, nutritionistId: string): Promise<void> {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new BadRequestException("Paciente informado nao existe.");
    }

    const nutritionist = await this.prisma.user.findUnique({ where: { id: nutritionistId } });
    if (!nutritionist) {
      throw new BadRequestException("Nutricionista informado nao existe.");
    }

    if (nutritionist.role !== UserRole.NUTRITIONIST && nutritionist.role !== UserRole.ADMIN) {
      throw new BadRequestException("Usuario informado nao possui perfil de nutricionista.");
    }
  }
}