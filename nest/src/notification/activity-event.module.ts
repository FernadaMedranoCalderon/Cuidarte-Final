import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityEventService } from './activity-event.service';
import { NotificationService } from './notification.service';
import { ElderlyModule } from '../elderly/elderly.module';
import { UsersModule } from '../users/users.module';
import { FamilyLinkModule } from '../family-link/family-link.module';
import { PushService } from './push.service';
import { DeviceTokenModule } from '../device-token/device-token.module';
import { MessageHelper } from './message.helper';

@Module({
  imports: [
    ElderlyModule,
    UsersModule,
    FamilyLinkModule,
    DeviceTokenModule,
  ],
  providers: [
    PrismaService,
    ActivityEventService,
    SchedulerService,
    NotificationService,
    PushService,
    MessageHelper,
  ],
  exports: [ActivityEventService],
})
export class ActivityEventModule {}