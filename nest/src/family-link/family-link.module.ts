import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FamilyLinkService } from './family-link.service';
import { FamilyLinkResolver } from './family-link.resolver';
import { ElderlyModule } from '../elderly/elderly.module';

@Module({
    imports: [ElderlyModule],
    providers: [FamilyLinkService, FamilyLinkResolver, PrismaService],
    exports: [FamilyLinkService],
})
export class FamilyLinkModule { }