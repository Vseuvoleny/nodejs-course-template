import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('favs')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}
  @Get()
  @HttpCode(200)
  async getAll() {
    return await this.favoriteService.getAll();
  }

  @Post(':entity/:id')
  @HttpCode(201)
  async addFavorite(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.favoriteService.addEntity(entity, id);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  async deleteFavorite(
    @Param('entity') entity: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.favoriteService.deleteEntity(entity, id);
  }
}
