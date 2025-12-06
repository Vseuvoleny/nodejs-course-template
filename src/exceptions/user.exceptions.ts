import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserIdException extends HttpException {
  constructor() {
    super('Invalid user ID (not UUID)', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message ?? 'Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('Невалидный пароль', HttpStatus.FORBIDDEN);
  }
}

export class NotModifiedException extends HttpException {
  constructor() {
    super('Элемент существует', HttpStatus.NOT_MODIFIED);
  }
}
