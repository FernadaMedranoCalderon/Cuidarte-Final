import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDTO } from '../entities/dto/Activity/CreateActivityDTO';
import { UpdateActivityDTO } from '../entities/dto/Activity/UpdateActivityDTO';
import { ActivityEventService } from '../notification/activity-event.service';
import { ActivityEventType, RepeatType, Activity } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(
    private prisma: PrismaService,
    private activityEventService: ActivityEventService,
  ) { }

  async create(dto: CreateActivityDTO) {
    const scheduledAt = new Date(`${dto.date}T${dto.time}:00`);

    if (isNaN(scheduledAt.getTime())) {
      throw new Error('Fecha u hora inválida');
    }

    const activity = await this.prisma.activity.create({
      data: {
        name: dto.name,
        type: dto.type,
        evidenceType: dto.evidenceType,
        repeat: dto.repeat,
        repeatDays: dto.repeatDays,
        scheduledAt,
        elderlyId: dto.elderlyId,
      },
    });

    await this.activityEventService.create({
      activity: activity,
      type: ActivityEventType.ACTIVITY_CREATED,
    });

    return activity;
  }

  async findByElderly(elderlyId: number) {
    return this.prisma.activity.findMany({
      where: { elderlyId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.activity.findUnique({
      where: { id },
    });
  }

  async update(dto: UpdateActivityDTO) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: dto.id },
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    const updatedActivity = await this.prisma.activity.update({
      where: { id: dto.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.evidenceType !== undefined ? { evidenceType: dto.evidenceType } : {}),
        ...(dto.repeat !== undefined ? { repeat: dto.repeat } : {}),
        ...(dto.repeatDays !== undefined ? { repeatDays: dto.repeatDays } : {}),
        ...(dto.scheduledAt !== undefined ? { scheduledAt: dto.scheduledAt } : {}),
      },
    });

    const hasDateChanged =
      dto.scheduledAt &&
      activity.scheduledAt &&
      new Date(dto.scheduledAt).getTime() !== activity.scheduledAt.getTime();

    if (hasDateChanged) {
      await this.activityEventService.create({
        activity: updatedActivity,
        type: ActivityEventType.ACTIVITY_UPDATED,
      });
    }

    return updatedActivity;
  }

  async reschedule(data: { activityId: number }) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: data.activityId },
    });

    if (!activity) {
      throw new Error('Actividad no encontrada');
    }

    if (activity.repeat === RepeatType.NONE) return activity;

    const newDate = this.getNewDate({ activity });

    if (
      newDate &&
      activity.scheduledAt &&
      newDate.getTime() === activity.scheduledAt.getTime()
    ) return activity;

    try {
      const updatedActivity = await this.prisma.activity.update({
        where: { id: data.activityId },
        data: {
          scheduledAt: newDate,
        },
      });

      await this.activityEventService.create({
        activity: updatedActivity,
        type: ActivityEventType.ACTIVITY_RESCHEDULED,
      });

      return updatedActivity;
    } catch {
      throw new Error('Error al reprogramar actividad');
    }
  }

  async remove(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    await this.activityEventService.create({
      activity,
      type: ActivityEventType.ACTIVITY_DELETED,
    });

    return this.prisma.activity.delete({
      where: { id },
    });
  }

  private getNewDate(data: { activity: Activity }): Date {
    const activity = data.activity;
    const oldDate = new Date(activity.scheduledAt);

    switch (activity.repeat) {
      case RepeatType.DAILY: {
        const date = new Date(oldDate);

        if (!activity.repeatDays) {
          date.setDate(date.getDate() + 1);
          return date;
        }

        const dayMap: Record<string, number> = {
          L: 1,
          M: 2,
          X: 3,
          J: 4,
          V: 5,
          S: 6,
          D: 0,
        };

        const allowedDays: boolean[] = Array(7).fill(false);
        let days = 0;
        for (const day of activity.repeatDays) {
          const v = dayMap[day];
          if (v !== undefined) {
            allowedDays[v] = true;
            days++;
          }
        }

        if (days === 0) {
          date.setDate(date.getDate() + 1);
          return date;
        }

        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        while (!allowedDays[next.getDay()]) {
          next.setDate(next.getDate() + 1);
        }

        return next;
      }

      case RepeatType.WEEKLY: {
        const date = new Date(oldDate);
        date.setDate(date.getDate() + 7);
        return date;
      }

      case RepeatType.MONTHLY: {
        const date = new Date(oldDate);
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    }

    return oldDate;
  }

  async postpone(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: id },
    });

  }
}