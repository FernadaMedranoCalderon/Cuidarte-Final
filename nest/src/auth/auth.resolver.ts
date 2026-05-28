import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from '../entities/dto/Auth/AuthResponseDTO';
import { LoginDTO } from '../entities/dto/Auth/LoginDTO';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponseDTO)
  login(@Args('data') data: LoginDTO) {
    return this.authService.login(data);
  }

  @Mutation(() => AuthResponseDTO)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}