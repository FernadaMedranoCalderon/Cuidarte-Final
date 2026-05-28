import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ElderlyDTO {
  @Field(() => Int)
  id!: number;

  @Field()
  linkCode!: string;

  @Field(() => Int)
  userId!: number;
}