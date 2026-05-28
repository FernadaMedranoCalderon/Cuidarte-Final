import { Module } from '@nestjs/common';
import { EvidenceMarkService } from './evidence-mark.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [EvidenceMarkService, PrismaService],
    exports: [EvidenceMarkService],
})
export class EvidenceMarkModule {}
