import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { ActivityType, EvidenceType, RepeatType } from '../../enums';

@ObjectType()
export class ActivityDTO {
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

    @Field({ nullable: true })
    repeatDays?: string;

    @Field(() => GraphQLISODateTime)
    scheduledAt!: Date;

    @Field(() => Int)
    elderlyId!: number;

    @Field(() => GraphQLISODateTime)
    createdAt!: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt!: Date;
}