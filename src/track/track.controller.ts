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
import { CreateTrackDto, UpdateTrackDto } from './create-track.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Get()
  async getAll() {
    return await this.trackService.getAll();
  }

  @Get(':id')
  async getTrackById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.getById(id);
  }

  @Post()
  @HttpCode(201)
  async createNewTrack(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.createNewTrack(createTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.trackService.deleteTrack(id);
  }

  @Put(':id')
  async updateTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTrackDto,
  ) {
    try {
      return await this.trackService.updateTrack(id, body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
