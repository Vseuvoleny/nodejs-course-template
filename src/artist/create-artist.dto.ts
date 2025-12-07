import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty({ message: 'Наименование обязательно' })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Признак гремми обязателен' })
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  grammy: boolean;
}
