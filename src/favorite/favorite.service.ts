import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Repository } from 'typeorm';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';
import { isUUID } from 'class-validator';
import {
  InvalidUserIdException,
  NotModifiedException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async getAll() {
    const result = await this.favoriteRepository.findOne({
      where: {},
      relations: ['track', 'artist', 'album'],
    });
    if (!result) {
      return { track: [], artist: [], album: [] };
    }

    return result;
  }

  async addEntity(entity: string, id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }

    switch (entity) {
      case 'album':
        return this.addAlbum(id);
      case 'artist':
        return this.addArtist(id);
      case 'track':
        return this.addTrack(id);

      default:
        throw new UserNotFoundException('Не найдена сущность');
    }
  }
  async deleteEntity(entity: string, id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }

    switch (entity) {
      case 'album':
        return this.deleteAlbum(id);
      case 'artist':
        return this.deleteArtist(id);
      case 'track':
        return this.deleteTrack(id);

      default:
        throw new UserNotFoundException('Не найдена сущность');
    }
  }

  private async addTrack(id: string) {
    const currentEntity = await this.trackRepository.findOneBy({ id });
    if (!currentEntity) {
      throw new UserNotFoundException('Не найден трек');
    }
    const result = await this.getAll();
    const currentAlbum = result.track.find((elem) => elem.id === id);
    if (currentAlbum) {
      throw new NotModifiedException();
    }

    result.track.push(currentEntity);
    await this.favoriteRepository.save(result);
  }

  private async addArtist(id: string) {
    const currentEntity = await this.artistRepository.findOneBy({ id });

    if (!currentEntity) {
      throw new UserNotFoundException('Не найден артист');
    }
    const result = await this.getAll();
    const currentArtist = result.artist.find((elem) => elem.id === id);
    if (currentArtist) {
      throw new NotModifiedException();
    }

    result.artist.push(currentEntity);

    const res = await this.favoriteRepository.save(result);
    return res;
  }

  private async addAlbum(id: string) {
    const currentEntity = await this.albumRepository.findOneBy({ id });
    if (!currentEntity) {
      throw new UserNotFoundException('Не найден трек');
    }
    const result = await this.getAll();
    const currentAlbum = result.album.find((elem) => elem.id === id);
    if (currentAlbum) {
      throw new NotModifiedException();
    }

    result.album.push(currentEntity);
    await this.favoriteRepository.save(result);
  }

  private async deleteTrack(id: string) {
    const currentEntity = await this.trackRepository.findOneBy({ id });
    if (!currentEntity) {
      throw new UserNotFoundException('Не найден трек');
    }
    const result = await this.getAll();
    const currentAlbum = result.track.find((elem) => elem.id === id);
    if (!currentAlbum) {
      throw new NotModifiedException();
    }

    const filteredTrack = result.track.filter((el) => el.id !== id);
    await this.favoriteRepository.save({ ...result, filteredTrack });
  }
  private async deleteArtist(id: string) {
    const currentEntity = await this.artistRepository.findOneBy({ id });
    if (!currentEntity) {
      throw new UserNotFoundException('Не найден трек');
    }
    const result = await this.getAll();
    const current = result.artist.find((elem) => elem.id === id);
    if (!current) {
      throw new NotModifiedException();
    }

    const filteredArtist = result.artist.filter((el) => el.id !== id);

    await this.favoriteRepository.save({ ...result, artist: filteredArtist });
  }
  private async deleteAlbum(id: string) {
    const currentEntity = await this.albumRepository.findOneBy({ id });
    if (!currentEntity) {
      throw new UserNotFoundException('Не найден трек');
    }
    const result = await this.getAll();
    const current = result.album.find((elem) => elem.id !== id);
    if (!current) {
      throw new NotModifiedException();
    }

    const filteredAlbum = result.album.filter((el) => el.id !== id);
    await this.favoriteRepository.save({ ...result, album: filteredAlbum });
  }
}
