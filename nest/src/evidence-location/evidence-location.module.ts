import { Module } from '@nestjs/common';
import { EvidenceLocationService } from './evidence-location.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [EvidenceLocationService, PrismaService],
    exports: [EvidenceLocationService],
})
export class EvidenceLocationModule {}
