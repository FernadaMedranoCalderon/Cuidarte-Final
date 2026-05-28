import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Activity, ActivityEventType, ActivityType } from '@prisma/client';
import { FamilyLinkService } from '../family-link/family-link.service';
import { NotificationService } from './notification.service';
import { ElderlyService } from '../elderly/elderly.service';
import { UsersService } from '../users/users.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageHelper } from './message.helper';


@Injectable()
export class ActivityEventService {
  constructor(
    private prisma: PrismaService,
    private familyLinkService: FamilyLinkService,
    private notificationService: NotificationService,
    private elderlyService: ElderlyService,
    private userService: UsersService,
    private msgHelper: MessageHelper,
  ) { }

  @OnEvent('activity.created')
  async create(data: { activity: Activity, type: ActivityEventType }) {
    console.log("ActivityEvent");
    const a = data.activity;

    if (!a) return;

    await this.checkToCancelNotification({
      activity: a,
      type: data.type,
    })

    const activityEvent = await this.prisma.activityEvent.create({
      data: {
        type: data.type,
        activityId: a.id
      },
    });

    const elderly = await this.elderlyService.findById(a.elderlyId);
    const user = await this.userService.findById(elderly!.userId);

    let msg = this.msgHelper.buildMessage(
      data.type,
      a.type,
      a.name,
    );

    await this.notificationService.create({
      userId: user!.id,
      activityEventId: activityEvent.id,
      message: msg,
      scheduledAt: new Date(),
    });

    msg = this.msgHelper.buildMessage(
      data.type,
      a.type,
      a.name,
      user!.name,      
    );

    const familyUserIds = await this.familyLinkService.findUserFamilyByElderly(a.elderlyId);
    console.log("fmailyUserids: " + familyUserIds);
    await this.notificationService.createMany({
      userIds: familyUserIds,
      activityEventId: activityEvent.id,
      message: msg,
      scheduledAt: new Date(),
    });


    if (!(data.type === ActivityEventType.ACTIVITY_CREATED ||
      data.type === ActivityEventType.ACTIVITY_UPDATED ||
      data.type === ActivityEventType.ACTIVITY_RESCHEDULED ||
      data.type === ActivityEventType.ACTIVITY_POSTPONED)) return activityEvent;
    
    msg = this.msgHelper.buildMessage(
      ActivityEventType.ACTIVITY_REMINDER,
      a.type,
      a.name,    
    );

    await this.notificationService.create({
      userId: elderly!.userId,
      activityEventId: activityEvent.id,
      message: msg,
      scheduledAt: a.scheduledAt,
    });

    msg = this.msgHelper.buildMessage(
        ActivityEventType.ACTIVITY_REMINDER,
        a.type,
        a.name,
        user!.name,
    );

    await this.notificationService.createMany({
      userIds: familyUserIds,
      activityEventId: activityEvent.id,
      message: msg,
      scheduledAt: a.scheduledAt,
    })

    return activityEvent;
  }

  private async checkToCancelNotification(data: { activity: Activity, type: ActivityEventType }) {
    if (
      data.type === ActivityEventType.ACTIVITY_DELETED ||
      data.type === ActivityEventType.ACTIVITY_UPDATED
    ) {
      await this.notificationService.deleteByActivity({ activityId: data.activity.id })
    }
  }
}