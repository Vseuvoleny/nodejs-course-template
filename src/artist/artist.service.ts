import { Injectable } from '@nestjs/common';

import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { CreateArtistDto } from './create-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';
import { FileLoggerService } from 'src/logger/logger.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private loggerService: FileLoggerService,
  ) {}

  async getAll() {
    try {
      const result = await this.artistRepository.find();
      this.loggerService.info(result);
      return result;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async getById(id: string) {
    try {
      const artist = await this.artistRepository.findOneBy({ id });
      if (!artist) {
        throw new UserNotFoundException('Артист не найден');
      }
      this.loggerService.info(artist);
      return artist;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async createNewArtist(body: Omit<Artist, 'id'>) {
    try {
      const newTrack = await this.artistRepository.save(body);
      this.loggerService.info(newTrack);
      return newTrack;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async deleteArtist(id: string) {
    try {
      const artist = await this.artistRepository.findOneBy({ id });
      if (!artist) {
        throw new UserNotFoundException('Артист не найден');
      }
      this.loggerService.info(artist);
      return this.artistRepository.delete({ id });
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async updateArtist(id: string, body: CreateArtistDto) {
    try {
      const artist = await this.artistRepository.findOneBy({ id });
      if (!artist) {
        throw new UserNotFoundException('Артист не найден');
      }

      const newBody: Omit<Artist, 'id'> = {
        ...artist,
        ...body,
      };

      return this.artistRepository.update({ id }, newBody);
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
