import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ActivityEventType } from '../../enums';

@InputType()
export class CreateActivityEventDTO {

  @Field()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @Field(() => ActivityEventType)
  @IsNotEmpty()
  type!: ActivityEventType;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityId!: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}