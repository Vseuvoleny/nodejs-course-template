import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User as IUser } from './create-user.dto';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4
  @Column()
  login: string;
  @Column()
  password: string;
  @Column({ type: 'int', default: 1 })
  version: number; // integer number, increments on update
  @Column('bigint')
  createdAt: number; // timestamp of creation
  @Column('bigint')
  updatedAt: number; // timestamp of last update
}
