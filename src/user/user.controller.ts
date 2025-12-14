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
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { UpdatePasswordDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getById(id);
  }

  /**
   * @deprecated
   * создание польваотеля происходит в контроллере auth
   */
  @Post()
  @HttpCode(201)
  async createNewUser() {
    return;
    // return await this.userService.createNewUser(createUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePasswordDto,
  ) {
    return await this.userService.updateUser(id, body);
  }
}
