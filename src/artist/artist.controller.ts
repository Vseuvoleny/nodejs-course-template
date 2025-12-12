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
import { CreateArtistDto, UpdateArtistDto } from './create-artist.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}
  @Get()
  async getAll() {
    return await this.artistService.getAll();
  }

  @Get(':id')
  async getArtistById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.artistService.getById(id);
  }

  @Post()
  @HttpCode(201)
  async createNewArtist(@Body() createUserDto: CreateArtistDto) {
    return await this.artistService.createNewArtist(createUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.artistService.deleteArtist(id);
  }

  @Put(':id')
  async updateArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateArtistDto,
  ) {
    try {
      return await this.artistService.updateArtist(id, body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Something went wrong');
    }
  }
}
