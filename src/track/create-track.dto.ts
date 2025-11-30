import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @IsUUID()
  artistId: string;

  @IsUUID()
  albumId: string;

  @IsNumber()
  duration: number;
}

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId: string;

  @IsUUID()
  @IsOptional()
  albumId: string;

  @IsNumber()
  @IsOptional()
  duration: number;
}
