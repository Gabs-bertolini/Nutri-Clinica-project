import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UserRole } from "../common/enums/user-role.enum";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: Omit<User, "password"> }> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existingUser) {
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

    return {
      accessToken: await this.signToken(user),
      user: this.removePassword(user),
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: Omit<User, "password"> }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    return {
      accessToken: await this.signToken(user),
      user: this.removePassword(user),
    };
  }

  private async signToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN") ?? "1d",
    });
  }

  private removePassword(user: User): Omit<User, "password"> {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}