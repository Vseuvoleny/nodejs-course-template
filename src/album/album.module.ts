import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { FileLoggerService } from 'src/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  providers: [AlbumService, FileLoggerService],
  controllers: [AlbumController],
})
export class AlbumModule {}
