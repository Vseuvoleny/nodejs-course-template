import { Injectable } from '@nestjs/common';
import { Db } from '../db/db';
import { randomUUID } from 'crypto';
import { CreateUserDto, User } from './create-user.dto';
import { UpdatePasswordDto } from './update-user.dto';
import { isUUID } from 'class-validator';
import {
  InvalidPasswordException,
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';

@Injectable()
export class UserService {
  private UserDB = new Db([]);

  getAll() {
    return this.UserDB.getAllUsers.map((e) => {
      delete e.password;
      return e;
    });
  }

  getById(id: string) {
    const user = this.UserDB.getById(id);
    delete user.password;
    return user;
  }

  createNewUser(body: CreateUserDto) {
    const mappedBody: User = {
      id: randomUUID(),
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      version: 1,
      ...body,
    };
    const newUser = this.UserDB.addUser(mappedBody);
    delete newUser.password;
    return newUser;
  }

  deleteUser(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.UserDB.hasUser(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.UserDB.removeUser(id);
  }

  updateUser(id: string, body: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.UserDB.hasUser(id);
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

    return this.UserDB.updateUser(id, newBody);
  }
}
