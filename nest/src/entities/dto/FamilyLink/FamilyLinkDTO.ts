import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FamilyLinkDTO {
  @Field(() => Int)
  id!: number;

  @Field()
  isActive!: boolean;

  @Field(() => Int)
  familyId!: number;

  @Field(() => Int)
  elderlyId!: number;

  @Field(() => String)
  createdAt!: Date;
}