import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoriteController } from './favorite/favorite.controller';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [UserModule, ArtistModule, TrackModule, AlbumModule, FavoriteModule],
  controllers: [FavoriteController],
  providers: [],
})
export class AppModule {}
