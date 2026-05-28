import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateDeviceTokenDTO {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  platform!: string; // android | ios 

  @IsNumber()
  userId!: number;
}