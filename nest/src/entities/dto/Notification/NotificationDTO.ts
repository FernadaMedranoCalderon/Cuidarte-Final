import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  activityEventId!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  message!: string;

  @Field()
  isRead!: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deliveredAt?: Date;
}