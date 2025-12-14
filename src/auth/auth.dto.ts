import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class TokensDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
}
