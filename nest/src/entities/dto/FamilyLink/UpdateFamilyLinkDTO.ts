import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateFamilyLinkDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
}