import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreateEvidencePhotoDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  activityLogId!: number;

  @Field(() => GraphQLUpload)
  @IsNotEmpty()
  file!: Promise<FileUpload>;
}