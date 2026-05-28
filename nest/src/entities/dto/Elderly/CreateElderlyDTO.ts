import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateElderlyDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId!: number;
  
}