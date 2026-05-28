import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Family {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;
}