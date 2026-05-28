import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field  } from '@nestjs/graphql';

@InputType()
export class LoginDTO {
@Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  deviceToken!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  platform!: string;
}