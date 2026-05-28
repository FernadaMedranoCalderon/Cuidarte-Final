import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateEvidenceLocationDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityLogId!: number;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  latitude!: number;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  longitude!: number;
}
