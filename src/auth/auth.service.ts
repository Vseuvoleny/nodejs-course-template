import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/create-user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { JwtModuleOptions, JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { RefreshTokenDto } from './auth.dto';
@Injectable()
export class AuthService {
  private readonly saltRounds = process.env.CRYPT_SALT ?? 10;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * hashPassword
   * хеширует пароль и возвращает его
   */
  public async hashPassword(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Что то пошло не так');
    }
  }

  /**
   * validateUser
   * проверка пользователя
   */
  public async validateUser(user: CreateUserDto) {
    try {
      const findedUser = await this.userRepository.findOneBy({
        login: user.login,
      });
      if (!findedUser) {
        throw new UserNotFoundException('Invalid Credential');
      }
      const isEqual = await bcrypt.compare(user.password, findedUser.password);
      if (!isEqual) {
        throw new UserNotFoundException('Invalid credentials');
      }
      //  достаем все данные пользователя кроме пароля
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...restUserData } = findedUser;
      return this.generateTokens(restUserData);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new Error('Что то пошло не так');
    }
  }

  private async generateTokens(user: Omit<User, 'password'>) {
    const accessTokenPayload = {
      sub: user.id,
      login: user.login,
      type: 'access',
    };

    const refreshTokenPayload = {
      sub: user.id,
      login: user.login,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env
          .TOKEN_EXPIRE_TIME as JwtModuleOptions['signOptions']['expiresIn'],
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env
          .TOKEN_REFRESH_EXPIRE_TIME as JwtModuleOptions['signOptions']['expiresIn'],
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      return;
    }
  }

  async refresh({ refreshToken }: RefreshTokenDto) {
    const payload = this.jwtService.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY as JwtVerifyOptions,
    );

    if (!payload || payload.type !== 'refresh') {
      throw new UserNotFoundException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UserNotFoundException('Invalid or expired refresh token');
    }

    return this.generateTokens(user);
  }
}
