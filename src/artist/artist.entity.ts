import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Artist as IArtist } from './create-artist.dto';

@Entity()
export class Artist implements IArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4
  @Column()
  name: string;
  @Column({ type: 'boolean' })
  grammy: boolean;
}
