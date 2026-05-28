import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ActivityStatus, EvidenceType } from '../../enums';
import { CreateEvidenceLocationDTO } from '../Evidence/CreateEvidenceLocationDTO';
import { CreateEvidencePhotoDTO } from '../Evidence/CreateEvidencePhotoDTO';
import { CreateEvidenceMarkDTO } from '../Evidence/CreateEvidenceMarkDTO';
import { CreateSkipReasonDTO } from '../Evidence/CreateSkipReasonDTO';

@InputType()
export class CreateActivityLogDTO {
  @Field(() => String)
  @IsNotEmpty()
  scheduledAt!: Date;

  @Field(() => ActivityStatus)
  @IsNotEmpty()
  status!: ActivityStatus;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityId!: number;

  @Field(() => EvidenceType)
  @IsNotEmpty()
  type!: EvidenceType;

  @Field(() => CreateEvidencePhotoDTO, { nullable: true })
  @IsOptional()
  evidencePhoto?: CreateEvidencePhotoDTO;

  @Field(() => CreateEvidenceMarkDTO, { nullable: true })
  @IsOptional()
  evidenceMark?: CreateEvidenceMarkDTO;

  @Field(() => CreateEvidenceLocationDTO, { nullable: true })
  @IsOptional()
  evidenceLocation?: CreateEvidenceLocationDTO;

  @Field(() => CreateSkipReasonDTO, { nullable: true })
  @IsOptional()
  skipReason?: CreateSkipReasonDTO;
}