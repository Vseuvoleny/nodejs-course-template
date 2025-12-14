import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/create-user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { JwtModuleOptions, JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
  InvalidPasswordException,
  RefreshTokenException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { RefreshTokenDto } from './auth.dto';
import { FileLoggerService } from 'src/logger/logger.service';
@Injectable()
export class AuthService {
  private readonly saltRounds = process.env.CRYPT_SALT ?? 10;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private loggerService: FileLoggerService,
  ) {}

  /**
   * hashPassword
   * хеширует пароль и возвращает его
   */
  public async hashPassword(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        Number(this.saltRounds),
      );
      return hashedPassword;
    } catch (error) {
      this.loggerService.error(error);
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
        throw new InvalidPasswordException();
      }
      // достаем все данные пользователя кроме пароля
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...restUserData } = findedUser;
      return this.generateTokens(restUserData);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof InvalidPasswordException) {
        throw error;
      }
      this.loggerService.error(error);
      throw new Error('Что то пошло не так');
    }
  }
  /**
   * создаем accesToken и refreshToken
   */
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
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env
          .TOKEN_EXPIRE_TIME as JwtModuleOptions['signOptions']['expiresIn'],
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env
          .TOKEN_REFRESH_EXPIRE_TIME as JwtModuleOptions['signOptions']['expiresIn'],
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * обновляет токен
   */
  async refresh({ refreshToken }: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env
          .JWT_SECRET_REFRESH_KEY as JwtVerifyOptions['secret'],
      });

      if (!payload || payload.type !== 'refresh') {
        throw new RefreshTokenException();
      }

      const user = await this.userRepository.findOneBy({ id: payload.sub });

      if (!user) {
        throw new UserNotFoundException();
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      this.loggerService.error(error);
      throw new RefreshTokenException();
    }
  }
}
