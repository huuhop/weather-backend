import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WeatherReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column('float')
  temperature: number;

  @Column('int')
  pressure: number;

  @Column('int')
  humidity: number;

  @Column('int',  { name: 'cloud_cover' })
  cloudCover: number;
}