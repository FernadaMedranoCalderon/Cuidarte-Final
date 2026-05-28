import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActivityStatus } from '../enums';

@ObjectType()
export class ActivityLog {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  scheduledAt!: Date;

  @Field(() => ActivityStatus)
  status!: ActivityStatus;

  @Field(() => Int)
  activityId!: number;

  @Field(() => String)
  createdAt!: Date;
}