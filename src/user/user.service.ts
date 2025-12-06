import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-user.dto';
import { isUUID } from 'class-validator';
import {
  InvalidPasswordException,
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll() {
    const users = await this.userRepository.find();
    return users.map((e) => {
      delete e.password;
      return e;
    });
  }

  async getById(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }

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

    const newUser = await this.userRepository.save(mappedBody);

    delete newUser.password;
    return newUser;
  }

  async deleteUser(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException();
    }
    const result = await this.userRepository.delete({ id });
    return result;
  }

  async updateUser(id: string, body: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException();
    }

    const { oldPassword, newPassword } = body;

    if (oldPassword !== user.password) {
      throw new InvalidPasswordException();
    }

    const newBody: User = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };
    this.userRepository.update({ id }, newBody);
  }
}
