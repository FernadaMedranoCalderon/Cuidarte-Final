import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { ActivityStatus } from '../../enums';

@InputType()
export class UpdateActivityLogDTO {
  @Field(() => ActivityStatus, { nullable: true })
  @IsOptional()
  status?: ActivityStatus;
}