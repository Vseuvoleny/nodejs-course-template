import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Track as ITrack } from './create-track.dto';

@Entity()
export class Track implements ITrack {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4
  @Column()
  name: string;
  @Column({ type: 'uuid', nullable: true, default: null })
  artistId: string; // refers to Artist
  @Column({ type: 'uuid', nullable: true, default: null })
  albumId: string; // refers to Album
  @Column('int')
  duration: number; // integer number
}
