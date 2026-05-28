import { Module } from '@nestjs/common';
import { SkipReasonService } from './skip-reason.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SkipReasonService, PrismaService],
  exports: [SkipReasonService],
})
export class SkipReasonModule {}