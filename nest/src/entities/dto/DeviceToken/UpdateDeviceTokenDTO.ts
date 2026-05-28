import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDeviceTokenDto {
  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}