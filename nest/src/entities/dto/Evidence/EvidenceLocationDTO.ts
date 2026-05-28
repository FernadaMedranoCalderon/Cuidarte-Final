import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class EvidenceLocationDTO {
  @Field(() => Int)
  id!: number;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}