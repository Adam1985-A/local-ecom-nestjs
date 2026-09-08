import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from '../users/user.entity.js';

@Entity('wallets')
export class Wallet extends BaseEntity {

  @Index({ unique: true }) 
  @Column({ name: 'user_id' }) 
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' }) 
  user!: User;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) 
  balance!: number;

  @Column({ name: 'locked_balance', type: 'decimal', precision: 15, scale: 2, default: 0 }) 
  lockedBalance!: number;

  @Column({ name: 'is_active', default: true }) 
  isActive!: boolean;
}
