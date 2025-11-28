import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Логин обязателен' })
  @MinLength(3, { message: 'Логин должен быть не менее 3 символов' })
  @MaxLength(20, { message: 'Логин должен быть не более 20 символов' })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;
}
