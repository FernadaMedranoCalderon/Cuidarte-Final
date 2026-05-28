import { InputType, Field, Int} from '@nestjs/graphql';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { ActivityType, EvidenceType, RepeatType } from '../../enums';

@InputType()
export class UpdateActivityDTO {
    @Field(() => Int)
    @IsInt()
    id!: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => ActivityType, { nullable: true })
    @IsOptional()
    type?: ActivityType;

    @Field(() => EvidenceType, { nullable: true })
    @IsOptional()
    evidenceType?: EvidenceType;

    @Field(() => RepeatType, { nullable: true })
    @IsOptional()
    repeat?: RepeatType;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    repeatDays?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    scheduledAt?: Date;
}