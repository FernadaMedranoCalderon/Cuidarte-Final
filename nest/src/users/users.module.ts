import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './user.resolver';
import { ElderlyModule } from '../elderly/elderly.module';
import { FamilyModule } from '../family/family.module';
import { FamilyService } from '../family/family.service';

@Module({
  imports: [ElderlyModule, FamilyModule],
  providers: [UsersService, UserResolver, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}