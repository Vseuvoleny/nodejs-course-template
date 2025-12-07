import { Injectable } from '@nestjs/common';

import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { CreateArtistDto } from './create-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async getAll() {
    const result = await this.artistRepository.find();
    return result;
  }

  async getById(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UserNotFoundException('Артист не найден');
    }
    return artist;
  }

  async createNewArtist(body: Omit<Artist, 'id'>) {
    const newTrack = await this.artistRepository.save(body);

    return newTrack;
  }

  async deleteArtist(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UserNotFoundException('Артист не найден');
    }
    return this.artistRepository.delete({ id });
  }

  async updateArtist(id: string, body: CreateArtistDto) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UserNotFoundException('Артист не найден');
    }

    const newBody: Omit<Artist, 'id'> = {
      ...artist,
      ...body,
    };

    return this.artistRepository.update({ id }, newBody);
  }
}
