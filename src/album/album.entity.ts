import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Album as IAlbum } from './create-album.dto';

@Entity()
export class Album implements IAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4
  @Column('int')
  year: number;
  @Column()
  name: string;
  @Column({ type: 'uuid', nullable: true, default: null })
  artistId: string;
}
