import { Injectable } from '@nestjs/common';

import { CreateAlbumDto } from './create-album.dto';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { Album } from './album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async getAll() {
    return await this.albumRepository.find();
  }

  async getById(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }

    const album = this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UserNotFoundException('Альбом не найден');
    }
    return album;
  }

  async createNewAlbum(body: Omit<Album, 'id'>) {
    const mappedBody: Omit<Album, 'id'> = {
      ...body,
    };
    const newTrack = await this.albumRepository.save(mappedBody);

    return newTrack;
  }

  async deleteAlbum(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const album = this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UserNotFoundException('Альбом не найден');
    }
    return await this.albumRepository.delete({ id });
  }

  async updateAlbum(id: string, body: CreateAlbumDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const album = this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UserNotFoundException('Альбом не найден');
    }

    const newBody: Omit<Album, 'id'> = {
      ...album,
      ...body,
    };

    return await this.albumRepository.update({ id }, newBody);
  }
}
