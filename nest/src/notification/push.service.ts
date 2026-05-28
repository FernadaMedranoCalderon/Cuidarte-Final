import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { NotificationStatus } from '@prisma/client';
import { DeviceTokenService } from '../device-token/device-token.service';

@Injectable()
export class PushService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushService.name);

  constructor(
    private prisma: PrismaService,
    private deviceTokenService: DeviceTokenService,
  ) {
    this.expo = new Expo();
  }

  async dispatch(notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) return;
    const deviceTokens = await this.deviceTokenService.getUserTokens(notification.userId);

    console.log(JSON.stringify(deviceTokens));
    const tokens = deviceTokens.map(t => t.token);
    if (!tokens.length) return;
    await this.send(tokens, notification.message);

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        deliveredAt: new Date(),
      },
    });
  }

  async send(tokens: string[], message: string, title?: string) {
    try {
      const validTokens = tokens.filter(token => Expo.isExpoPushToken(token));

      if (!validTokens.length) {
        return [];
      }

      const messages: ExpoPushMessage[] = validTokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body: message,
        priority: 'high',
      }));

      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
        }
      }

      return tickets;

    } catch (error) {
      throw error;
    }
  }
}