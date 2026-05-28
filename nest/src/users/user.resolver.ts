import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserDTO } from '../entities/dto/User/UserDTO';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateUserDTO } from '../entities/dto/User/CreateUserDTO';
import { UpdateUserDTO } from '../entities/dto/User/UpdateUserDTO';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => UserDTO)
  createUser(@Args('data') data: CreateUserDTO) {
    return this.usersService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserDTO])
  users() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDTO, { nullable: true })
  userByName(@Args('name') name: string) {
    return this.usersService.findByName(name);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDTO, { nullable: true })
  userByEmail(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO)
  updateUsuario(@Args('data') data: UpdateUserDTO) {
    return this.usersService.update(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO)
  deleteUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}