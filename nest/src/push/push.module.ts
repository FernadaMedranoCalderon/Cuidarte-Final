import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from '../notification/push.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeviceTokenService } from '../device-token/device-token.service';

@Module({
  controllers: [PushController],
  providers: [PushService, PrismaService, DeviceTokenService],
})
export class PushModule {}