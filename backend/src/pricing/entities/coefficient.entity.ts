import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('coefficients')
@Unique(['group', 'key'])
export class Coefficient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  group!: string; // e.g., delivery, complexity, risk, tech, feature

  @Column({ type: 'text' })
  key!: string; // e.g., normal/fast/urgent or react/nextjs

  @Column({ type: 'text', nullable: true })
  label?: string; // localized label

  @Column({ type: 'real' })
  value!: number; // multiplier
}


