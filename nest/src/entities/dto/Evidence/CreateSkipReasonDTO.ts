import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SkipReasonType } from '../../enums';

@InputType()
export class CreateSkipReasonDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityLogId!: number;

  @Field(() => SkipReasonType)
  @IsNotEmpty()
  reason!: SkipReasonType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customReason?: string;
}