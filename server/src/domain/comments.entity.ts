/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Trip from './trip.entity';
import { User } from './user.entity';

/**
 * A Comments.
 */
@Entity('comments')
export default class Comments extends BaseEntity {
  @Column({ name: 'text', nullable: false })
  @Length(5, 500)
  text: string;

  @ManyToOne(() => Comments, comment => comment.comments, { nullable: true })
  reply?: Comments;

  @OneToMany(() => Comments, comment => comment.reply, { cascade: true, nullable: true })
  comments?: Comments[];

  @ManyToOne(type => Trip)
  trip: Trip;

  @ManyToOne(type => User, { eager: true })
  user: User;
}
