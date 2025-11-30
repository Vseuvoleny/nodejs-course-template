import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty({ message: 'Наименование обязательно' })
  name: string;

  @IsString()
  artistId: string;

  @IsString()
  albumId: string;

  @IsNumber()
  duration: number;
}
