import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FamilyDTO {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;
}