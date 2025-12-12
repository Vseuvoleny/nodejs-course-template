import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty({ message: 'Наименование обязательно' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Год обязателен' })
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null; // refers to Artist
}
