import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeviceTokenService {
  constructor(private prisma: PrismaService) {}
 
  async registerToken(data: {
    userId: number;
    token: string;
    platform: string;
  }) {
    return this.prisma.deviceToken.upsert({
      where: { token: data.token },
      create: {
        token: data.token,
        platform: data.platform,
        userId: data.userId,
      },
      update: {
        userId: data.userId,
        platform: data.platform,
      },
    });
  }

  async getUserTokens(userId: number) {
    return this.prisma.deviceToken.findMany({
      where: { userId },
    });
  }

  async removeToken(token: string) {
    return this.prisma.deviceToken.deleteMany({
      where: { token },
    });
  }

  async removeInvalidTokens(tokens: string[]) {
    return this.prisma.deviceToken.deleteMany({
      where: {
        token: {
          in: tokens,
        },
      },
    });
  }
}