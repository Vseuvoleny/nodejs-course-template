import { Injectable } from '@nestjs/common';
import { AlbumDb } from 'src/db/albumdb';
import { Album, CreateAlbumDto } from './create-album.dto';
import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';

import {
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';

@Injectable()
export class AlbumService {
  private AlbumDBInstance = new AlbumDb([]);

  getAll() {
    return this.AlbumDBInstance.getAllAlbums.map((e) => {
      return e;
    });
  }

  getById(id: string) {
    const album = this.AlbumDBInstance.getById(id);
    return album;
  }

  createNewAlbum(body: CreateAlbumDto) {
    const mappedBody: Album = {
      id: randomUUID(),
      ...body,
    };
    const newTrack = this.AlbumDBInstance.addAlbum(mappedBody);

    return newTrack;
  }

  deleteAlbum(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.AlbumDBInstance.hasAlbum(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.AlbumDBInstance.removeAlbums(id);
  }

  updateAlbum(id: string, body: CreateAlbumDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const album = this.AlbumDBInstance.hasAlbum(id);
    if (!album) {
      throw new UserNotFoundException();
    }

    const newBody: Album = {
      ...album,
      ...body,
    };

    return this.AlbumDBInstance.updateAlbums(id, newBody);
  }
}
