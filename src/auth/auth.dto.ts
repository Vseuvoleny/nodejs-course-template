import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class TokensDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}
