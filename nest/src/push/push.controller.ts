import { Controller, Post, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PushService } from '../notification/push.service';
import { Token } from 'graphql';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('dispatch/:id')
  @HttpCode(HttpStatus.OK)
  async dispatchNotification(@Param('id', ParseIntPipe) id: number) {
    await this.pushService.dispatch(id);
    return {
      success: true,
    };
  }

  @Post('send-direct')
  @HttpCode(HttpStatus.OK)
  async sendDirectNotification(
    @Body() body: { tokens: string[]; message: string; title?: string },
  ) {
    console.log(body.tokens)
    const tickets = await this.pushService.send(body.tokens, body.message, body.title);
    return {
      success: true,
      tickets,
    };
  }
}