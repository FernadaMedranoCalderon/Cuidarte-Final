import {
  ObjectType,
  Field,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { NotificationStatus } from '../enums';

@ObjectType()
export class Notification {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  activityEventId!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  message!: string;

  @Field(() => NotificationStatus)
  status!: NotificationStatus;

  @Field()
  isRead!: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  sendAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deliveredAt?: Date | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}