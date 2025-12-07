import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { ArtistDb } from 'src/db/artistdb';
import {
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';
import { Artist, CreateArtistDto } from './create-artist.dto';

@Injectable()
export class ArtistService {
  private ArtistDBInstance = new ArtistDb([]);

  getAll() {
    return this.ArtistDBInstance.getAllArtist.map((e) => {
      return e;
    });
  }

  getById(id: string) {
    const artist = this.ArtistDBInstance.getById(id);
    return artist;
  }

  createNewArtist(body: CreateArtistDto) {
    const mappedBody: Artist = {
      id: randomUUID(),
      ...body,
    };
    const newTrack = this.ArtistDBInstance.addArtist(mappedBody);

    return newTrack;
  }

  deleteArtist(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.ArtistDBInstance.hasArtist(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.ArtistDBInstance.removeArtist(id);
  }

  updateArtist(id: string, body: CreateArtistDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const artist = this.ArtistDBInstance.hasArtist(id);
    if (!artist) {
      throw new UserNotFoundException();
    }

    const newBody: Artist = {
      ...artist,
      ...body,
    };

    return this.ArtistDBInstance.updateArtist(id, newBody);
  }
}
