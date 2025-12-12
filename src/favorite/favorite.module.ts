import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Album } from 'src/album/album.entity';
import { Artist } from 'src/artist/artist.entity';
import { Track } from 'src/track/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Album, Artist, Track])],
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
