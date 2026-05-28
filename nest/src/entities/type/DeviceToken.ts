import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DeviceToken {
  @Field(() => Int)
  id!: number;

  @Field()
  token!: string;

  @Field()
  isActive!: boolean;

  @Field()
  platform!: string;

  @Field()
  createdAt!: Date;

  @Field(() => Int)
  userId!: number;
}