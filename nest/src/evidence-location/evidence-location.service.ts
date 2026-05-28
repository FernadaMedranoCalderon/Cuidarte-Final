import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvidenceLocationDTO } from '../entities/dto/Evidence/CreateEvidenceLocationDTO';
import { EvidenceLocationDTO } from '../entities/dto/Evidence/EvidenceLocationDTO';

@Injectable()
export class EvidenceLocationService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateEvidenceLocationDTO, tx: any = this.prisma): Promise<EvidenceLocationDTO> {
        const evidenceLocation = await tx.evidenceLocation.create({
            data: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                activityLogId: dto.activityLogId,
            },
        });
        return evidenceLocation as EvidenceLocationDTO;
    }

    async findById(id: number): Promise<EvidenceLocationDTO | null> {
        return this.prisma.evidenceLocation.findUnique({
            where: { id },
        }) as Promise<EvidenceLocationDTO | null>;
    }

    async findByActivityLog(activityLogId: number): Promise<EvidenceLocationDTO | null> {
        return this.prisma.evidenceLocation.findUnique({
            where: { activityLogId },
        }) as Promise<EvidenceLocationDTO | null>;
    }

    async findAll(): Promise<EvidenceLocationDTO[]> {
        return this.prisma.evidenceLocation.findMany() as Promise<EvidenceLocationDTO[]>;
    }

    async update(id: number, dto: Partial<CreateEvidenceLocationDTO>): Promise<EvidenceLocationDTO> {
        const evidenceLocation = await this.prisma.evidenceLocation.update({
            where: { id },
            data: {
                ...(dto.latitude && { latitude: dto.latitude }),
                ...(dto.longitude && { longitude: dto.longitude }),
            },
        });
        return evidenceLocation as EvidenceLocationDTO;
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.evidenceLocation.delete({
            where: { id },
        });
        return true;
    }
}
