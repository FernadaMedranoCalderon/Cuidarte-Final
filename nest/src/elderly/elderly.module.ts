import { Module } from '@nestjs/common';
import { ElderlyService } from './elderly.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ElderlyService],
  exports: [ElderlyService],
})
export class ElderlyModule {}