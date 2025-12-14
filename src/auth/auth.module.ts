import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { FileLoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env
          .TOKEN_EXPIRE_TIME as JwtModuleOptions['signOptions']['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, FileLoggerService],
})
export class AuthModule {}
