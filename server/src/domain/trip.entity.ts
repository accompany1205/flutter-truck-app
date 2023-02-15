/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Comments from './comments.entity';
import Match from './match.entity';
import ClientAccount from './client-account.entity';
import { EMarchandise } from './enumeration/e-marchandise';
import { ETripState } from './enumeration/e-trip-state';
import Location from './location.entity';

/**
 * A Trip.
 */
@Entity('trip')
export default class Trip extends BaseEntity {
  @Column({ type: 'boolean', name: 'is_full', nullable: true })
  isFull?: boolean;

  @Column({ type: 'integer', name: 'width', nullable: true })
  width: number;

  @Column({ type: 'integer', name: 'height', nullable: true })
  height: number;

  @Column({ type: 'integer', name: 'length', nullable: true })
  length: number;

  @Column({ type: 'integer', name: 'weight', nullable: true })
  weight: number;

  @Column({ type: 'tinyint', name: 'marchandise', nullable: true })
  marchandise?: any;

  @Column({ type: 'datetime', name: 'etd', nullable: false })
  etd: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'tinyint', name: 'state', nullable: false })
  state: ETripState;

  @Column({ type: 'datetime', name: 'eta', nullable: true })
  eta: string;

  @Column({ type: 'double', name: 'distance', nullable: false })
  distance: number;

  @Column({ type: 'text', name: 'tripImg', nullable: false })
  tripImg?: string;

  @OneToOne(type => Location, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE', cascade: true, eager: true})
  @JoinColumn()
  origin: Location;

  @OneToOne(type => Location, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE', cascade: true, eager: true})
  @JoinColumn()
  destination: Location;

  @OneToMany(
    type => Comments,
    other => other.trip,
    { nullable: true }
  )
  comments?: Comments[];

  @OneToMany(
    type => Match,
    other => other.trip,
    { nullable: true, eager: false, cascade: true, onDelete: 'CASCADE' }
  )
  matches?: Match[];

  @ManyToOne(type => ClientAccount)
  clientAccount: ClientAccount;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
