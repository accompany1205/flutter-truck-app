/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Region from './region.entity';
import Location from './location.entity';

/**
 * A Country.
 */
@Entity('country')
export default class Country extends BaseEntity {
  @Column({ name: 'country_name' })
  countryName: string;

  @OneToOne(
    type => Region,
    other => other.country
  )
  @JoinColumn()
  region: Region;

  @OneToOne(
    type => Location,
    other => other.country
  )
  location: Location;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
