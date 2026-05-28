import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../enums';

@InputType()
export class CreateUserDTO {

  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field(() => UserRole, { defaultValue: UserRole.ELDERLY })
  @IsEnum(UserRole)
  role?: UserRole;
}