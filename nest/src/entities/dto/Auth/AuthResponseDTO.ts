import { ObjectType, Field } from '@nestjs/graphql';
import { UserDTO } from '../User/UserDTO';

@ObjectType()
export class AuthResponseDTO {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field(() => UserDTO)
  user!: UserDTO;
}