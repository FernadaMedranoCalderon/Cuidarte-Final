import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EvidencePhotoDTO {
  @Field(() => Int)
  id!: number;

  @Field()
  photoUrl!: string;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}