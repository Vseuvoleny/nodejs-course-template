import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './create-track.dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    return this.trackService.getById(id);
  }

  @Post()
  @HttpCode(201)
  createNewTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createNewTrack(createTrackDto);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string) {
    this.trackService.deleteTrack(id);
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() body: CreateTrackDto) {
    try {
      return this.trackService.updateTrack(id, body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
