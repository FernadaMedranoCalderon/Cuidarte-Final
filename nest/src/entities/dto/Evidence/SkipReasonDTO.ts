import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SkipReasonType } from '../../enums';

@ObjectType()
export class SkipReasonDTO {
  @Field(() => Int)
  id!: number;

  @Field(() => SkipReasonType)
  reason!: SkipReasonType;

  @Field(() => String, { nullable: true })
  customReason?: string | null;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}