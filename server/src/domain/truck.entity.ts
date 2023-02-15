/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

//import Driver from './driver.entity';
import Match from './match.entity';
import TransporterAccount from './transporter-account.entity';
import { ETruckType } from './enumeration/e-truck-type';

/**
 * A Truck.
 */
@Entity('truck')
export default class Truck extends BaseEntity {

  @Column({ name: 'model', nullable: false })
  model: string;
  
  @Column({ type: 'text', name: 'plate_number', nullable: false })
  plateNumber: string;

  @Column({ type: 'text', name: 'conteneur_plate_number', nullable: true })
  conteneurPlateNumber?: string;

  @Column({ type: 'mediumint', name: 'year', nullable: false })
  year: number;

  @Column({ type: 'tinyint', name: 'type', nullable: false })
  type: ETruckType;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imgUrl?: string;

  @Column({ type: 'double', name: 'width', nullable: true })
  width?: number;

  @Column({ type: 'double', name: 'height', nullable: true })
  height?: number;

  @Column({ type: 'double', name: 'length', nullable: true })
  length?: number;

  @Column({ type: 'double', name: 'max_weight', nullable: true })
  maxWeight?: number;

  /*
  @OneToOne(
    type => Driver,
    other => other.truck,
    {nullable: true}
  )
  @JoinColumn()
  driver: Driver;
  */
  @OneToMany(
    type => Match,
    other => other.truck,
    {nullable: true}
  )
  matches: Match[];

  @ManyToOne(type => TransporterAccount, 
    transporter => transporter.trucks, 
    {nullable: true, cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE'})
  transporterAccount: TransporterAccount;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
