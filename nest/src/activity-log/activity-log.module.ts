import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogResolver } from './activity-log.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';
import { EvidenceLocationModule } from '../evidence-location/evidence-location.module';
import { EvidenceMarkModule } from '../evidence-mark/evidence-mark.module';
import { EvidencePhotoModule } from '../evidence-photo/evidence-photo.module';
import { SkipReasonModule } from '../skip-reason/skip-reason.module';
import { EvidenceFactory } from './evidence.factory';

@Module({
    imports: [
        PrismaModule, 
        ActivityModule, 
        EvidenceLocationModule,
        EvidenceMarkModule,
        EvidencePhotoModule,
        SkipReasonModule,
    ],
    providers: [ActivityLogService, ActivityLogResolver, EvidenceFactory],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
