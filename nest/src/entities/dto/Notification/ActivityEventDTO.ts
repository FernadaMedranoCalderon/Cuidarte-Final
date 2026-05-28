import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActivityEventType } from '../../enums';

@ObjectType()
export class ActivityEventDTO {
  @Field(() => Int)
  id!: number;

  @Field(() => ActivityEventType)
  type!: ActivityEventType;

  @Field(() => Int)
  activityId!: number;

  @Field(() => String)
  createdAt!: Date;
}