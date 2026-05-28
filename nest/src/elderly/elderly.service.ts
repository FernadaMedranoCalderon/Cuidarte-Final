import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateElderlyDTO } from '../entities/dto/Elderly/CreateElderlyDTO';
import { Elderly } from '../entities/type/Elderly';

@Injectable()
export class ElderlyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateElderlyDTO) {
    return this.prisma.elderly.create({
      data: {
        userId: dto.userId,
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.elderly.findUnique({
      where: { userId },
    });
  }

  async findById(id: number) {
    return this.prisma.elderly.findUnique({
      where: { id },
    });
  }

  async findByLinkCode(linkCode: string) {
    return this.prisma.elderly.findUnique({
      where: { linkCode },
    });
  }
}