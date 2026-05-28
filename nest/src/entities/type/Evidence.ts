import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class EvidenceMark {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}

@ObjectType()
export class EvidencePhoto {
  @Field(() => Int)
  id!: number;

  @Field()
  photoUrl!: string;

  @Field(() => Int)
  activityLogId!: number;

  @Field(() => String)
  createdAt!: Date;
}

@ObjectType()
export class EvidenceLocation {
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