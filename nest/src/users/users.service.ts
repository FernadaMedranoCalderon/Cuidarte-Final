import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from '../entities/dto/User/UserDTO';
import { CreateUserDTO } from '../entities/dto/User/CreateUserDTO';
import { UpdateUserDTO } from '../entities/dto/User/UpdateUserDTO';
import * as bcrypt from 'bcryptjs';
import { ElderlyService } from '../elderly/elderly.service';
import { FamilyService } from '../family/family.service';
import { UserRole } from '../entities/enums';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private elderlyService: ElderlyService,
    private familyService: FamilyService,
  ) {}
  
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByName(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateUserDTO): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? UserRole.ELDERLY;

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role,
      },
    });

    if (role === UserRole.ELDERLY) {
      await this.elderlyService.create({ userId: user.id });
    }

    if (role === UserRole.FAMILY) {
      await this.familyService.create({ userId: user.id });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt,
    };
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.prisma.user.findMany();

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      createdAt: u.createdAt,
    }));
  }

  async update(dto: UpdateUserDTO): Promise<UserDTO> {
    const user = await this.prisma.user.update({
      where: { id: dto.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt,
    };
  }

  async remove(id: number): Promise<UserDTO> {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt,
    };
  }
}