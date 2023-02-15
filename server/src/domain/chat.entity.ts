/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Conversation from './conversation.entity';

/**
 * A Chat.
 */
@Entity('chat')
export default class Chat extends BaseEntity {
  @Column({ name: 'text' })
  text: string;

  @Column({ type: 'text', name: 'date' })
  date: any;

  @Column({ name: 'author' })
  author: string;

  @ManyToOne(type => Conversation)
  conversation: Conversation;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
