import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('base_prices')
@Unique(['projectType', 'scale'])
export class BasePrice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  projectType!: string; // e.g., webapp, shop, erp

  @Column({ type: 'text' })
  scale!: string; // small, medium, large

  @Column({ type: 'real' })
  baseUsd!: number; // base price in USD
}


