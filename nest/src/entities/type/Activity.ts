import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActivityType, EvidenceType, RepeatType } from '../enums';

@ObjectType()
export class Activity {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => ActivityType)
  type!: ActivityType;

  @Field(() => EvidenceType)
  evidenceType!: EvidenceType;

  @Field(() => RepeatType)
  repeat!: RepeatType;

  @Field(() => String, { nullable: true })
  repeatDays?: string;

  @Field(() => String)
  scheduledAt!: Date;

  @Field(() => Int)
  elderlyId!: number;

  @Field(() => String)
  createdAt!: Date;

  @Field(() => String)
  updatedAt!: Date;
}