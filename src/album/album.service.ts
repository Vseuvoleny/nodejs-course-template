import { Injectable } from '@nestjs/common';

import { CreateAlbumDto } from './create-album.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { Album } from './album.entity';
import { FileLoggerService } from 'src/logger/logger.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    private loggerService: FileLoggerService,
  ) {}

  async getAll() {
    try {
      return await this.albumRepository.find();
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }

  async getById(id: string) {
    try {
      const album = await this.albumRepository.findOneBy({ id });
      if (!album) {
        throw new UserNotFoundException('Альбом не найден');
      }
      return album;
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }

  async createNewAlbum(body: Omit<Album, 'id'>) {
    try {
      const mappedBody: Omit<Album, 'id'> = {
        ...body,
      };
      const newTrack = await this.albumRepository.save(mappedBody);

      return newTrack;
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }

  async deleteAlbum(id: string) {
    try {
      const album = await this.albumRepository.findOneBy({ id });

      if (!album) {
        throw new UserNotFoundException('Альбом не найден');
      }
      return await this.albumRepository.delete({ id });
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }

  async updateAlbum(id: string, body: CreateAlbumDto) {
    try {
      const album = await this.albumRepository.findOneBy({ id });
      if (!album) {
        throw new UserNotFoundException('Альбом не найден');
      }

      const newBody: Omit<Album, 'id'> = {
        ...album,
        ...body,
      };
      const result = await this.albumRepository.update({ id }, newBody);
      this.loggerService.info(result);
      return result;
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }
}
