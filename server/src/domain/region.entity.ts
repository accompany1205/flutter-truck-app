/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Country from './country.entity';

/**
 * A Region.
 */
@Entity('region')
export default class Region extends BaseEntity {
  @Column({ name: 'region_name' })
  regionName: string;

  @OneToOne(
    type => Country,
    other => other.region
  )
  country: Country;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
