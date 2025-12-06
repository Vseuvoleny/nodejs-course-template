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
import { ArtistService } from './artist.service';
import { UpdateArtistDto } from './create-artist.dto';
import { Artist } from './artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}
  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    return this.artistService.getById(id);
  }

  @Post()
  @HttpCode(201)
  createNewArtist(@Body() createUserDto: Omit<Artist, 'id'>) {
    return this.artistService.createNewArtist(createUserDto);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string) {
    this.artistService.deleteArtist(id);
  }

  @Put(':id')
  updateArtist(@Param('id') id: string, @Body() body: UpdateArtistDto) {
    try {
      return this.artistService.updateArtist(id, body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
