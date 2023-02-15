/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Chat from './chat.entity';
import Match from './match.entity';

/**
 * A Conversation.
 */
@Entity('conversation')
export default class Conversation extends BaseEntity {
  @OneToMany(
    type => Chat,
    other => other.conversation
  )
  chats: Chat[];

  @OneToOne(
    type => Match,
    other => other.conversation
  )
  match: Match;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
