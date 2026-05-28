import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDTO } from '../entities/dto/Family/CreateFamilyDTO';

@Injectable()
export class FamilyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFamilyDTO) {
    return this.prisma.family.create({
      data: {
        userId: dto.userId,
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.family.findUnique({
      where: { userId },
    });
  }

  async findById(id: number) {
    return this.prisma.family.findUnique({
      where: { id },
    });
  }
}