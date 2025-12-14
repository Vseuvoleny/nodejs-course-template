import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-user.dto';

import {
  InvalidPasswordException,
  UserNotFoundException,
} from '../exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { FileLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
    private loggerService: FileLoggerService,
  ) {}

  async getAll() {
    try {
      const users = await this.userRepository.find();
      return users.map((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...rest } = e;

        return rest;
      });
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async getById(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new UserNotFoundException();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...rest } = user;

      return rest;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async createNewUser(body: CreateUserDto) {
    try {
      const mappedBody: Omit<User, 'id'> = {
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        version: 1,
        ...body,
      };

      const user = await this.userRepository.findOneBy({ login: body.login });
      if (user) {
        throw new UserNotFoundException('Такой пользователь существует');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...newUser } =
        await this.userRepository.save(mappedBody);

      return newUser;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new UserNotFoundException();
      }
      const result = await this.userRepository.delete({ id });

      return result;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async updateUser(id: string, body: UpdatePasswordDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new UserNotFoundException();
      }

      const { oldPassword, newPassword } = body;

      const isEqual = await bcrypt.compare(oldPassword, newPassword);

      if (isEqual) {
        throw new InvalidPasswordException();
      }
      const password = await this.authService.hashPassword(newPassword);

      const newBody: User = {
        ...user,
        password,
        version: user.version + 1,
        updatedAt: new Date().getTime(),
      };
      await this.userRepository.update({ id }, newBody);
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
