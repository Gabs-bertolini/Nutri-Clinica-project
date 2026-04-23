import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "../common/enums/user-role.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDoubtDto } from "./dto/create-doubt.dto";
import { UpdateDoubtDto } from "./dto/update-doubt.dto";

@Injectable()
export class DoubtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDoubtDto) {
    await this.validateRelations(dto.patientId, dto.nutritionistId);

    return this.prisma.doubt.create({
      data: {
        title: dto.title,
        question: dto.question,
        patientId: dto.patientId,
        nutritionistId: dto.nutritionistId,
        answerText: dto.answerText,
        isPublic: dto.isPublic,
      },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });
  }

  async findAll() {
    return this.prisma.doubt.findMany({
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const doubt = await this.prisma.doubt.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });

    if (!doubt) {
      throw new NotFoundException("Duvida nao encontrada.");
    }

    return doubt;
  }

  async update(id: string, dto: UpdateDoubtDto) {
    await this.ensureExists(id);

    if (dto.patientId || dto.nutritionistId) {
      const current = await this.prisma.doubt.findUnique({ where: { id } });
      await this.validateRelations(dto.patientId ?? current!.patientId, dto.nutritionistId ?? current!.nutritionistId ?? undefined);
    }

    return this.prisma.doubt.update({
      where: { id },
      data: {
        title: dto.title,
        question: dto.question,
        patientId: dto.patientId,
        nutritionistId: dto.nutritionistId,
        answerText: dto.answerText,
        isPublic: dto.isPublic,
      },
      include: {
        patient: { include: { user: true } },
        nutritionist: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.doubt.delete({ where: { id } });
    return { message: "Duvida removida com sucesso." };
  }

  private async ensureExists(id: string): Promise<void> {
    const doubt = await this.prisma.doubt.findUnique({ where: { id } });
    if (!doubt) {
      throw new NotFoundException("Duvida nao encontrada.");
    }
  }

  private async validateRelations(patientId: string, nutritionistId?: string): Promise<void> {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new BadRequestException("Paciente informado nao existe.");
    }

    if (!nutritionistId) {
      return;
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