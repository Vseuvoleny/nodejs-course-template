import { Injectable } from '@nestjs/common';

import { CreateTrackDto } from './create-track.dto';

import { UserNotFoundException } from 'src/exceptions/user.exceptions';
import { Track } from './track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileLoggerService } from 'src/logger/logger.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
    private loggerService: FileLoggerService,
  ) {}

  async getAll() {
    try {
      const tracks = await this.trackRepository.find();
      return tracks;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async getById(id: string) {
    try {
      const track = await this.trackRepository.findOneBy({ id });
      if (!track) {
        throw new UserNotFoundException();
      }

      return track;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async createNewTrack(body: CreateTrackDto) {
    try {
      const newTrack = await this.trackRepository.save(body);
      this.loggerService.info(newTrack);
      return newTrack;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async deleteTrack(id: string) {
    try {
      const result = await this.trackRepository.delete({ id });
      if (!result) {
        throw new UserNotFoundException();
      }
      this.loggerService.info(result);
      return result;
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  async updateTrack(id: string, body: CreateTrackDto) {
    try {
      const user = await this.trackRepository.findOneBy({ id });
      if (!user) {
        throw new UserNotFoundException();
      }

      const newBody: Omit<Track, 'id'> = {
        ...user,
        ...body,
      };

      this.trackRepository.update({ id }, newBody);
      this.loggerService.info(newBody);
      return newBody;
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
