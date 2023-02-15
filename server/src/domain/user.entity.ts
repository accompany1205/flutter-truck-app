import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import TransporterAccount from './transporter-account.entity';
import ClientAccount from './client-account.entity';
import Reputation from './reputation.entity';


@Entity('jhi_user')
export class User extends BaseEntity {

  @ApiModelProperty({ uniqueItems: true, example: 'myuser', description: 'User login' })
  @Column({ unique: true })
  login: string;

  @ApiModelProperty({ example: 'Zakaria', description: 'User first name' })
  @Column({ nullable: false })
  firstName: string;

  @ApiModelProperty({ example: 'Hmaidouch', description: 'User last name' })
  @Column({ nullable: false })
  lastName: string;

  @ApiModelProperty({ example: 'myuser@localhost.com', description: 'User email' })
  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @ApiModelProperty({ example: 'true', description: 'User activation' })
  @Column({ nullable: false })
  activated: boolean;

  @ApiModelProperty({ example: 'en', description: 'User language' })
  @Column({ nullable: true })
  langKey?: string;

  @Column({ type: 'text', name: 'stripe_id' })
  stripeId: string;

  // eslint-disable-next-line
  @ManyToMany(type => Authority)
  @JoinTable()
  @ApiModelProperty({ isArray: true, description: 'Array of permissions' })
  authorities?: any[];

  @ApiModelProperty({ example: 'myuser', description: 'User password' })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  activationKey?: string;

  @Column({ nullable: true })
  resetKey?: string;

  @Column({ nullable: true })
  resetDate?: Date;

  // Shared Attributes

  @Column({ name: 'phone', nullable: false })
  phone: string;

  @Column({ name: 'referal', nullable: true })
  referal?: string;

  @Column({ name: 'refered_by', nullable: true })
  referedBy?: string;

  @Column({ name: 'mini_bio', nullable: true })
  miniBio?: string;

  @Column({ type: 'boolean', name: 'verified_phone', nullable: false })
  verifiedPhone: boolean;

  @Column({ type: 'boolean', name: 'verified_email', nullable: false })
  verifiedEmail: boolean;

  @OneToOne(type => TransporterAccount, transporterAccount => transporterAccount.user, {
    nullable: true
  })
  transporterAccount?: TransporterAccount;

  @OneToOne(type => ClientAccount, {
    nullable: true
  })
  @JoinColumn()
  clientAccount?: ClientAccount;

  @Column({ name: 'date of birth', nullable: false })
  dateOfBirth: Date;

  @OneToMany(type => Reputation, reputation => reputation.to)
  givenReputations: Reputation[];

  @OneToMany(type => Reputation, reputation => reputation.from)
  receivedReputations: Reputation[];

}
