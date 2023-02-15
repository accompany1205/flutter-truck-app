/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Conversation from './conversation.entity';
import Truck from './truck.entity';
import Trip from './trip.entity';
import { EMatchState } from './enumeration/e-match-state';

/**
 * A Match.
 */
@Entity('match')
export default class Match extends BaseEntity {
  @Column({ type: 'tinyint', name: 'status' })
  status: EMatchState;

  @Column({ type: 'datetime', name: 'date', nullable: false })
  date: Date;

  @OneToOne(
    type => Conversation,
    other => other.match
  )
  @JoinColumn()
  conversation?: Conversation;

  @ManyToOne(type => Truck)
  truck: Truck;

  @ManyToOne(type => Trip)
  trip: Trip;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
