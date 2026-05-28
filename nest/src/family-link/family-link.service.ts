import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ElderlyService } from '../elderly/elderly.service';

@Injectable()
export class FamilyLinkService {
    constructor(
        private prisma: PrismaService,
        private elderlyService: ElderlyService,
    ) {}

    async create(familyId: number, linkCode: string) {
        const elderly = await this.elderlyService.findByLinkCode(linkCode);

        if (!elderly) {
            throw new Error('Invalid link code');
        }

        return this.prisma.familyLink.create({
            data: {
                familyId: familyId,
                elderlyId: elderly.id,
            },
        });
    }

    async update(id: number, isActive: boolean) {
        return this.prisma.familyLink.update({
            where: { id },
            data: {
                isActive,
            },
        });
    }

    async findUserFamilyByElderly(elderlyId: number): Promise<number[]> {
        const result = await this.prisma.familyLink.findMany({
            where: { elderlyId },
            select: {
            family: {
                select: {
                userId: true,
                },
            },
            },
        });

        return result.map(r => r.family.userId);
    }

    async findByFamily(familyId: number) {
        return this.prisma.familyLink.findMany({
            where: { familyId: familyId },
        });
    }

    async deactivate(id: number) {
        return this.prisma.familyLink.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
}