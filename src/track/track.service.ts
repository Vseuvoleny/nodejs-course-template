import { Injectable } from '@nestjs/common';
import { TrackDb } from 'src/db/trackdb';
import { CreateTrackDto, Track } from './create-track.dto';
import { randomUUID } from 'crypto';
import { isUUID } from 'class-validator';
import {
  InvalidUserIdException,
  UserNotFoundException,
} from 'src/exceptions/user.exceptions';

@Injectable()
export class TrackService {
  private TrackDBInstance = new TrackDb([]);

  getAll() {
    return this.TrackDBInstance.getAllTracks.map((e) => {
      return e;
    });
  }

  getById(id: string) {
    const track = this.TrackDBInstance.getById(id);
    return track;
  }

  createNewTrack(body: CreateTrackDto) {
    const mappedBody: Track = {
      id: randomUUID(),
      ...body,
    };
    const newTrack = this.TrackDBInstance.addTrack(mappedBody);

    return newTrack;
  }

  deleteTrack(id: string) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.TrackDBInstance.hasTrack(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.TrackDBInstance.removeTrack(id);
  }

  updateTrack(id: string, body: CreateTrackDto) {
    if (!isUUID(id)) {
      throw new InvalidUserIdException();
    }
    const user = this.TrackDBInstance.hasTrack(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const newBody: Track = {
      ...user,
      ...body,
    };

    return this.TrackDBInstance.updateTrack(id, newBody);
  }
}
