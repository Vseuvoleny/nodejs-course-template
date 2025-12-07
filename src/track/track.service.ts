import { Injectable } from '@nestjs/common';

import { CreateTrackDto } from './create-track.dto';

import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { Track } from './track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async getAll() {
    const tracks = await this.trackRepository.find();
    return tracks;
  }

  async getById(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new UserNotFoundException();
    }

    return track;
  }

  async createNewTrack(body: CreateTrackDto) {
    const newTrack = await this.trackRepository.save(body);

    return newTrack;
  }

  async deleteTrack(id: string) {
    const result = await this.trackRepository.delete({ id });
    if (!result) {
      throw new UserNotFoundException();
    }
    return result;
  }

  async updateTrack(id: string, body: CreateTrackDto) {
    const user = await this.trackRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException();
    }

    const newBody: Omit<Track, 'id'> = {
      ...user,
      ...body,
    };

    this.trackRepository.update({ id }, newBody);
    return newBody;
  }
}
