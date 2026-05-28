import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { SkipReasonType } from '../enums';

@ObjectType()
export class SkipReason {
  @Field(() => Int)
  id!: number;

  @Field(() => SkipReasonType)
  reason!: SkipReasonType;

  @Field(() => String, { nullable: true })
  customReason?: string | null;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}