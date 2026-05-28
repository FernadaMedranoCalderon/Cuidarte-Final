import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateFamilyLinkDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  familyId!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  linkCode!: string;
}