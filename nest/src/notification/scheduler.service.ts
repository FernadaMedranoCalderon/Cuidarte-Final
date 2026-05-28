import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PushService } from './push.service';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class SchedulerService implements OnModuleDestroy {
  private timers = new Map<number, NodeJS.Timeout>();

  constructor(
    private pushService: PushService,
    private prisma: PrismaService,
  ) { }

  async scheduleNotification(data: {
    notificationId: number;
    sendAt: Date;
  }) {
    const delay = data.sendAt.getTime() - Date.now();

    if (delay <= 0) {
      await this.pushService.dispatch(data.notificationId);

      await this.prisma.notification.delete({
        where: { id: data.notificationId },
      });

      return;
    }

    const timer = setTimeout(async () => {
      try {
        await this.pushService.dispatch(data.notificationId);

        await this.prisma.notification.delete({
          where: { id: data.notificationId },
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.timers.delete(data.notificationId);
      }
    }, delay);

    this.timers.set(data.notificationId, timer);
  }

  async cancelNotification(notificationIds: number | number[]) {
    const ids = Array.isArray(notificationIds)
      ? notificationIds
      : [notificationIds];

    for (const id of ids) {
      const timer = this.timers.get(id);

      if (!timer) continue;

      clearTimeout(timer);

      this.timers.delete(id);
    }
  }

  onModuleDestroy() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
  }
}