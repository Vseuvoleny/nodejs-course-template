import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
import { FileLoggerService } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthService, FileLoggerService],
  controllers: [UserController],
})
export class UserModule {}
