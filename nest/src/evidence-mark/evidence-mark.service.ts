import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvidenceMarkDTO } from '../entities/dto/Evidence/CreateEvidenceMarkDTO';
import { EvidenceMarkDTO } from '../entities/dto/Evidence/EvidenceMarkDTO';

@Injectable()
export class EvidenceMarkService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateEvidenceMarkDTO, tx: any = this.prisma): Promise<EvidenceMarkDTO> {
        const evidenceMark = await tx.evidenceMark.create({
            data: {
                activityLogId: dto.activityLogId,
            },
        });
        return evidenceMark as EvidenceMarkDTO;
    }

    async findById(id: number): Promise<EvidenceMarkDTO | null> {
        return this.prisma.evidenceMark.findUnique({
            where: { id },
        }) as Promise<EvidenceMarkDTO | null>;
    }

    async findByActivityLog(activityLogId: number): Promise<EvidenceMarkDTO | null> {
        return this.prisma.evidenceMark.findUnique({
            where: { activityLogId },
        }) as Promise<EvidenceMarkDTO | null>;
    }

    async findAll(): Promise<EvidenceMarkDTO[]> {
        return this.prisma.evidenceMark.findMany() as Promise<EvidenceMarkDTO[]>;
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.evidenceMark.delete({
            where: { id },
        });
        return true;
    }
}
