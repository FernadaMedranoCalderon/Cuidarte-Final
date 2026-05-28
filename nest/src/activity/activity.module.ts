import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from './activity.service';
import { ActivityResolver } from './activity.resolver';
import { ActivityEventModule } from '../notification/activity-event.module';

@Module({
  imports: [
    ActivityEventModule,
  ],
  providers: [
    ActivityService,
    ActivityResolver,
    PrismaService,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}