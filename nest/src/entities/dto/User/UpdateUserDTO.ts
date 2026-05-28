import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateUserDTO } from './CreateUserDTO';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateUserDTO extends PartialType(CreateUserDTO) {

  @Field(() => Int)
  @IsInt()
  id!: number;
}