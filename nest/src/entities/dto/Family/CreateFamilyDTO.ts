import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateFamilyDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}