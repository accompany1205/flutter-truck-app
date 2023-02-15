/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, OneToMany, } from 'typeorm';

import { BaseEntity } from './base/base.entity';
import Identity from './identity.entity';
import Reputation from './reputation.entity';
import Trip from './trip.entity';

import { ApiModelProperty } from '@nestjs/swagger';

import { User } from './user.entity';

/**
 * A ClientAccount.
 */
@Entity('client_account')
export default class ClientAccount extends BaseEntity {

  @ApiModelProperty({ required: true })
  @OneToOne(type => User, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ApiModelProperty({ required: false })
  @OneToOne(type => Identity, identity => identity.clientAccount)
  @JoinColumn()
  identity?: Identity;

  @ApiModelProperty({ required: false })
  @OneToMany(type => Trip, trip => trip.clientAccount)
  trips?: Trip[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
