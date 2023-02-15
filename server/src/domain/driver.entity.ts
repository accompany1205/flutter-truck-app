/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Truck from './truck.entity';

/**
 * A Driver.
 */
@Entity('driver')
export default class Driver extends BaseEntity {
  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'current_coordinate' })
  currentCoordinate: string;
/*
  @OneToOne(
    type => Truck,
    other => other.driver
  )
  truck: Truck;
  */
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
