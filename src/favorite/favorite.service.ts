import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Repository } from 'typeorm';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';

import {
  NotModifiedException,
  Unprocessable_EntityException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { FileLoggerService } from 'src/logger/logger.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    @InjectRepository(Track) private trackRepository: Repository<Track>,
    private loggerService: FileLoggerService,
  ) {}

  async getAll() {
    try {
      const result = await this.favoriteRepository.findOne({
        where: {},
        relations: ['tracks', 'artists', 'albums'],
      });
      if (!result) {
        return { tracks: [], artists: [], albums: [] };
      }

      return result;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async addEntity(entity: string, id: string) {
    try {
      switch (entity) {
        case 'album':
          return await this.addAlbum(id);
        case 'artist':
          return await this.addArtist(id);
        case 'track':
          return await this.addTrack(id);

        default:
          throw new Unprocessable_EntityException();
      }
    } catch (error) {
      this.loggerService.error(error);
    }
  }
  async deleteEntity(entity: string, id: string) {
    try {
      switch (entity) {
        case 'album':
          return await this.deleteAlbum(id);
        case 'artist':
          return await this.deleteArtist(id);
        case 'track':
          return await this.deleteTrack(id);

        default:
          throw new Unprocessable_EntityException();
      }
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async addTrack(id: string) {
    try {
      const currentEntity = await this.trackRepository.findOneBy({ id });
      if (!currentEntity) {
        throw new UserNotFoundException('Не найден трек');
      }
      const result = await this.getAll();
      const currentAlbum = result.tracks.find((elem) => elem.id === id);
      if (currentAlbum) {
        throw new NotModifiedException();
      }

      result.tracks.push(currentEntity);
      this.loggerService.error(result);
      await this.favoriteRepository.save(result);
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async addArtist(id: string) {
    try {
      const currentEntity = await this.artistRepository.findOneBy({ id });

      if (!currentEntity) {
        throw new UserNotFoundException('Не найден артист');
      }
      const result = await this.getAll();
      const currentArtist = result.artists.find((elem) => elem.id === id);
      if (currentArtist) {
        throw new NotModifiedException();
      }

      result.artists.push(currentEntity);

      const res = await this.favoriteRepository.save(result);
      return res;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async addAlbum(id: string) {
    try {
      const currentEntity = await this.albumRepository.findOneBy({ id });
      if (!currentEntity) {
        throw new UserNotFoundException('Не найден трек');
      }
      const result = await this.getAll();
      const currentAlbum = result.albums.find((elem) => elem.id === id);
      if (currentAlbum) {
        throw new NotModifiedException();
      }

      result.albums.push(currentEntity);
      await this.favoriteRepository.save(result);
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  private async deleteTrack(id: string) {
    try {
      const currentEntity = await this.trackRepository.findOneBy({ id });
      if (!currentEntity) {
        throw new UserNotFoundException('Не найден трек');
      }
      const result = await this.getAll();
      const currentAlbum = result.tracks.find((elem) => elem.id === id);
      if (!currentAlbum) {
        throw new NotModifiedException();
      }

      const filteredTrack = result.tracks.filter((el) => el.id !== id);
      await this.favoriteRepository.save({ ...result, filteredTrack });
    } catch (error) {
      this.loggerService.error(error);
    }
  }
  private async deleteArtist(id: string) {
    try {
      const currentEntity = await this.artistRepository.findOneBy({ id });
      if (!currentEntity) {
        throw new UserNotFoundException('Не найден Артист');
      }
      const result = await this.getAll();
      const current = result.artists.find((elem) => elem.id === id);
      if (!current) {
        throw new NotModifiedException();
      }

      const filteredArtist = result.artists.filter((el) => el.id !== id);

      await this.favoriteRepository.save({ ...result, artist: filteredArtist });
    } catch (error) {
      this.loggerService.error(error);
    }
  }
  private async deleteAlbum(id: string) {
    try {
      const currentEntity = await this.albumRepository.findOneBy({ id });
      if (!currentEntity) {
        throw new UserNotFoundException('Не найден трек');
      }
      const result = await this.getAll();
      const current = result.albums.find((elem) => elem.id !== id);
      if (!current) {
        throw new NotModifiedException();
      }

      const filteredAlbum = result.albums.filter((el) => el.id !== id);
      await this.favoriteRepository.save({ ...result, album: filteredAlbum });
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
