/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { EIdentity } from './enumeration/e-identity';
import ClientAccount from './client-account.entity';

/**
 * A Identity.
 */
@Entity('identity')
export default class Identity extends BaseEntity {
  @Column({ type: 'text', name: 'identity' })
  imageUrl: string;

  @Column({ name: 'identity_content_type' })
  identityContentType?: string;

  @Column({ type: 'integer', name: 'type'})
  type: EIdentity;

  @OneToOne(type => ClientAccount, clientAccount => clientAccount.identity)
  @JoinColumn()
  clientAccount?: ClientAccount;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
