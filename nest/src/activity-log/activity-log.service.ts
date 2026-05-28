import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityLogDTO } from '../entities/dto/ActivityLog/CreateActivityLog';
import { UpdateActivityLogDTO } from '../entities/dto/ActivityLog/UpdateActivityLog';
import { ActivityLogDTO } from '../entities/dto/ActivityLog/ActivityLogDTO';
import { ActivityService } from '../activity/activity.service';
import { SkipReasonService } from '../skip-reason/skip-reason.service';
import { EvidenceFactory } from './evidence.factory';
import { EvidenceType } from '@prisma/client';

@Injectable()
export class ActivityLogService {
    constructor(
        private prisma: PrismaService,
        private activityService: ActivityService,
        private skipReasonService: SkipReasonService,
        private evidenceFactory: EvidenceFactory,
    ) { }

    async create(dto: CreateActivityLogDTO) {
        const { activity } = await this.prisma.$transaction(async (tx) => {
            const activityLog = await tx.activityLog.create({
                data: {
                    scheduledAt: dto.scheduledAt,
                    status: dto.status,
                    activityId: dto.activityId,
                },
            });

            const activity = await this.activityService.findById(dto.activityId);

            if (!activity) {
                throw new Error('Activity not found');
            }

            if (dto.skipReason) {
                await this.skipReasonService.create(
                    {
                        ...dto.skipReason,
                        activityLogId: activityLog.id,
                    },
                    tx,
                );
            } else {
                const evidenceType = activity.evidenceType;

                let evidenceData: any = {};

                if (evidenceType === EvidenceType.PHOTO) evidenceData = dto.evidencePhoto;
                if (evidenceType === EvidenceType.MARK) evidenceData = dto.evidenceMark;
                if (evidenceType === EvidenceType.LOCATION) evidenceData = dto.evidenceLocation;

                await this.evidenceFactory.create(
                    evidenceType,
                    {
                        ...evidenceData,
                        activityLogId: activityLog.id,
                    },
                    tx,
                );
            }

            return { activity };
        });

        await this.activityService.reschedule({
            activityId: activity.id,
        });

        return true;
    }

    async findById(id: number): Promise<ActivityLogDTO | null> {
        return this.prisma.activityLog.findUnique({
            where: { id },
        }) as Promise<ActivityLogDTO | null>;
    }

    async findByActivity(activityId: number): Promise<ActivityLogDTO[]> {
        return this.prisma.activityLog.findMany({
            where: { activityId },
        }) as Promise<ActivityLogDTO[]>;
    }

    async findAll(): Promise<ActivityLogDTO[]> {
        return this.prisma.activityLog.findMany() as Promise<ActivityLogDTO[]>;
    }

    async update(id: number, dto: UpdateActivityLogDTO): Promise<ActivityLogDTO> {
        const activityLog = await this.prisma.activityLog.update({
            where: { id },
            data: {
                ...(dto.status && { status: dto.status }),
            },
        });
        return activityLog as ActivityLogDTO;
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.activityLog.delete({
            where: { id },
        });
        return true;
    }
}