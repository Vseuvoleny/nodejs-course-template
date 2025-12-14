import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { FileLoggerService } from 'src/logger/logger.service';
@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackService, FileLoggerService],
  controllers: [TrackController],
})
export class TrackModule {}
