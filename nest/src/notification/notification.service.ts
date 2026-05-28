import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulerService } from './scheduler.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private schedulerService: SchedulerService,
  ) { }

  async findByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: { activityEvent: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(data: { userId: number; notificationId: number }) {
    return this.prisma.notification.updateMany({
      where: {
        id: data.notificationId,
        userId: data.userId,
      },
      data: {
        isRead: true,
        deliveredAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, deliveredAt: new Date() },
    });
  }

  async countUnread(userId: number) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async findOne(userId: number, notificationId: number) {
    return this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
      include: { activityEvent: true },
    });
  }

  async create(data: {
    userId: number;
    activityEventId: number;
    message: string;
    scheduledAt: Date;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        activityEventId: data.activityEventId,
        message: data.message,
        sendAt: data.scheduledAt,
      },
    });

    await this.schedulerService.scheduleNotification({
      notificationId: notification.id,
      sendAt: data.scheduledAt,
    });

    return notification;
  }

  async createMany(data: {
    userIds: number[];
    activityEventId: number;
    message: string;
    scheduledAt?: Date;
  }) {
    const notifications = await Promise.all(
      data.userIds.map((userId) =>
        this.prisma.notification.create({
          data: {
            userId,
            activityEventId: data.activityEventId,
            message: data.message,
            sendAt: data.scheduledAt,
          },
        })
      )
    );

    if (data.scheduledAt) {
      for (const notification of notifications) {
        await this.schedulerService.scheduleNotification({
          notificationId: notification.id,
          sendAt: data.scheduledAt,
        });
      }
    }

    return notifications;
  }

  async deleteByActivity(data: { activityId: number }) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        activityEvent: {
          activityId: data.activityId,
        },
      },
      select: {
        id: true,
      },
    });

    const ids = notifications.map(n => n.id);
    await this.schedulerService.cancelNotification(ids);

    return this.prisma.notification.deleteMany({
      where: {
        activityEvent: {
          activityId: data.activityId,
        },
      },
    });
  }

  async delete(data: { userId: number; notificationId: number }) {
    this.schedulerService.cancelNotification(data.notificationId);

    return this.prisma.notification.deleteMany({
      where: {
        id: data.notificationId,
        userId: data.userId,
      },
    });
  }
}