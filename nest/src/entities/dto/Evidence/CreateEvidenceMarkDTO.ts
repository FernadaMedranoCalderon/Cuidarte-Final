import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateEvidenceMarkDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityLogId!: number;
}
