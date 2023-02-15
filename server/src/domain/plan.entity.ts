/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column} from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { IsDecimal, Min } from 'class-validator';

/**
 * A Match.
 */
@Entity('plan')
export default class Plan extends BaseEntity {

  @Column({ type: 'text', name: 'label', nullable: false })
  label: string;

  @Min(0)
  @IsDecimal({'decimal_digits': '2'})
  @Column({ type: 'double', name: 'price', nullable: false })
  price: number;

  @Min(0)
  @Column({ type: 'double', name: 'kilometers', nullable: true })
  kilometers?: number;

  @Min(0)
  @Column({ type: 'smallint', name: 'months', nullable: true })
  months?: number;
  
}