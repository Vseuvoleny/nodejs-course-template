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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async getAll() {
    const users = await this.userRepository.find();
    return users.map((e) => {
      delete e.password;
      return e;
    });
  }

  async getById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException();
    }

    delete user.password;

    return user;
  }

  async createNewUser(body: CreateUserDto) {
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
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException();
    }
    const result = await this.userRepository.delete({ id });

    return result;
  }

  async updateUser(id: string, body: UpdatePasswordDto) {
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
  }
}
