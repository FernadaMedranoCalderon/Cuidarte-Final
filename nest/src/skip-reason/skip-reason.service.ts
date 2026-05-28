import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkipReasonType } from '@prisma/client';

@Injectable()
export class SkipReasonService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        reason: SkipReasonType;
        activityLogId: number;
        customReason?: string;
    }, tx: any = this.prisma) {
        
        const skipReason = await tx.skipReason.create({
            data: {
                reason: data.reason,
                activityLogId: data.activityLogId,
                customReason: data.customReason ?? null,
            },
        });

        return skipReason;
    }

    async findById(id: number) {
        return this.prisma.skipReason.findUnique({
            where: { id },
        });
    }

    async findByActivityLog(activityLogId: number) {
        return this.prisma.skipReason.findUnique({
            where: { activityLogId },
        });
    }

    async findAll() {
        return this.prisma.skipReason.findMany();
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.skipReason.delete({
                where: { id },
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}