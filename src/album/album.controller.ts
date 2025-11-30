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

import { AlbumService } from './album.service';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}
  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getById(id);
  }

  @Post()
  @HttpCode(201)
  createNewAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createNewAlbum(createAlbumDto);
  }

  @Delete(':id')
  deleteAlbum(@Param('id') id: string) {
    this.albumService.deleteAlbum(id);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() body: UpdateAlbumDto) {
    try {
      return this.albumService.updateAlbum(id, body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
