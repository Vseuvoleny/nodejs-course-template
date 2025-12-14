import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/create-user.dto';

import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );
    return this.userService.createNewUser({
      login: createUserDto.login,
      password: hashedPassword,
    });
  }
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.validateUser(createUserDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    console.log('!!');

    return await this.authService.refresh(refreshToken);
  }
}
