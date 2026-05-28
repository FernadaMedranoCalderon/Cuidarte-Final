import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ActivityType, EvidenceType, RepeatType} from '../../enums';

@InputType()
export class CreateActivityDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => ActivityType)
  @IsNotEmpty()
  type!: ActivityType;

  @Field(() => EvidenceType, { nullable: true })
  @IsOptional()
  evidenceType?: EvidenceType;

  @Field(() => RepeatType, { nullable: true })
  @IsOptional()
  repeat?: RepeatType;

  @Field({ nullable: true })
  @IsOptional()
  repeatDays?: string;

  @Field()
  @IsNotEmpty()
  date!: string;

  @Field()
  @IsNotEmpty()
  time!: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  elderlyId!: number;
}