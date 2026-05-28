import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  phone!: string;

  @Field(() => Int)
  elderlyProfileId!: number;

  @Field(() => String)
  createdAt!: Date;
}