/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Truck from './truck.entity';
import Reputation from './reputation.entity';
import Comments from './comments.entity';

import { User } from './user.entity';

/**
 * A TransporterAccount.
 */
@Entity('transporter_account')
export default class TransporterAccount extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ type: 'text', name: 'patent', nullable: true })
  patent?: string;

  @Column({ name: 'patent_content_type', nullable: true })
  patentContentType?: string;

  @Column({ type: 'double', name: 'balance', nullable: false })
  balance: number;

  @Column({ type: 'datetime', name: 'end_of_subscription', nullable: true })
  endOfSubscription: Date;

  @Column({ type: 'text', name: 'insurance', nullable: true })
  insurance?: string;

  @Column({ name: 'insurance_content_type', nullable: true })
  insuranceContentType?: string;

  @OneToOne(type => User, user => user.transporterAccount, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn()
  user: User;

  @OneToMany(type => Truck, truck => truck.transporterAccount)
  trucks: Truck[];

  averageRating?: number;

  totalTrucks?: number;
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
