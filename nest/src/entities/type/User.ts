import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRole } from '../enums';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => String)
  createdAt!: Date;
}