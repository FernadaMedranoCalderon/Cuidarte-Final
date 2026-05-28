import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateNotificationDTO {
  @Field(() => Int)
  @IsNotEmpty()
  activityEventId!: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @Field()
  @IsNotEmpty()
  message!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  deliveredAt?: Date;
}