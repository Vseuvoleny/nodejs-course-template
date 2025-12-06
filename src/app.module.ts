import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoriteModule } from './favorite/favorite.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoriteModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '261294',
      database: 'nest',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
