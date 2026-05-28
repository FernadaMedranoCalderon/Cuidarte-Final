import { Field, ObjectType, Int } from '@nestjs/graphql';
import { UserRole } from '../../enums';

@ObjectType()
export class UserDTO {

  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  createdAt!: Date;
}