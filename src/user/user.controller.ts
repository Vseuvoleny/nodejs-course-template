import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import {} from 'class-validator';
import { UpdatePasswordDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Post()
  @HttpCode(201)
  createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createNewUser(createUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    this.userService.deleteUser(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdatePasswordDto) {
    try {
      this.userService.updateUser(id, body);
      return { message: 'Пароль успешно изменен' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
