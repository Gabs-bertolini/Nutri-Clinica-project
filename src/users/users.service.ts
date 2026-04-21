import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UserRole } from "../common/enums/user-role.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Omit<User, "password">> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existing) {
      throw new BadRequestException("Email ja esta em uso.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? UserRole.PATIENT,
      },
    });

    return this.removePassword(user);
  }

  async findAll(): Promise<Array<Omit<User, "password">>> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return users.map((user) => this.removePassword(user));
  }

  async findOne(id: string): Promise<Omit<User, "password">> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("Usuario nao encontrado.");
    }

    return this.removePassword(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, "password">> {
    await this.ensureExists(id);

    const data: Record<string, string> = {};

    if (dto.name) {
      data.name = dto.name;
    }

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.role) {
      data.role = dto.role;
    }

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.removePassword(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: "Usuario removido com sucesso." };
  }

  private async ensureExists(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuario nao encontrado.");
    }
  }

  private removePassword(user: User): Omit<User, "password"> {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}