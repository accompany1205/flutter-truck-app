/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Trip from './trip.entity';

/**
 * A Location.
 */
@Entity('location')
export default class Location extends BaseEntity {
  @Column({ name: 'street_address', nullable: true})
  streetAddress?: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode?: string;

  @Column({ name: 'city', nullable: false })
  city: string;

  @Column({ name: 'state_province', nullable: true })
  stateProvince?: string;

  @Column({ name: 'country', nullable: false })
  country: string;

  @Column({ name: 'latitude', nullable: true })
  latitude?: number;

  @Column({ name: 'longitude', nullable: true })
  longitude?: number;
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
