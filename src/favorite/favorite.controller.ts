import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}
  @Get()
  getAll() {
    return this.favoriteService.getAll();
  }

  @Post(':entity/:id')
  @HttpCode(201)
  addFavorite(@Param('entity') entity: string, @Param('id') id: string) {
    return this.favoriteService.addEntity(entity, id);
  }

  @Delete(':entity/:id')
  deleteFavorite(@Param('entity') entity: string, @Param('id') id: string) {
    this.favoriteService.deleteEntity(entity, id);
  }
}
