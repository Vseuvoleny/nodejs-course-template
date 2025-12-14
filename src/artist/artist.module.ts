import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { FileLoggerService } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  providers: [ArtistService, FileLoggerService],
  controllers: [ArtistController],
})
export class ArtistModule {}
