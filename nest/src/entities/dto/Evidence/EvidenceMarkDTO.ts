import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EvidenceMarkDTO {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}