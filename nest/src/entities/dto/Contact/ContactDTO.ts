import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ContactDTO {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  phone!: string;

  @Field(() => Int)
  elderlyId!: number;

  @Field(() => String)
  createdAt!: Date;
}