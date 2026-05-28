import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}