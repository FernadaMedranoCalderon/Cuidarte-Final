import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActivityEventType } from '../enums';

@ObjectType()
export class ActivityEvent {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  activityId!: number;

  @Field(() => ActivityEventType)
  type!: ActivityEventType;

  @Field(() => String)
  createdAt!: Date;
}