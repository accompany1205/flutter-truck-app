/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import { User } from './user.entity';
import Match from './match.entity';

/**
 * A Reputation.
 */
@Entity('reputation')
export default class Reputation extends BaseEntity {
  
  @IsInt()
  @Max(5)
  @Min(0)
  @Column({ type: 'integer', name: 'rate', nullable: false })
  rate: number;

  @Length(10, 500)
  @Column({ name: 'comment', nullable: true})
  comment: string;

  @ManyToOne(() => User, user => user.givenReputations, {nullable: false})
  from: User;

  @ManyToOne(() => User, user => user.receivedReputations, {nullable: false})
  to: User;

  @ManyToOne(type => Match, {nullable: false})
  match: Match;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
