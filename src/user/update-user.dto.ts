import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsNotEqualTo } from 'src/password-validator/password-validator.validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Логин обязателен' })
  @MinLength(3, { message: 'Логин должен быть не менее 3 символов' })
  @MaxLength(20, { message: 'Логин должен быть не более 20 символов' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: ' Новый пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsNotEqualTo('oldPassword', {
    message: 'Новый пароль не должен совпадать со старым',
  })
  newPassword: string;
}
