import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from '../users/user.entity.js';
import { Wallet } from './wallet.entity.js';
import { WalletTransactionSource } from '../common/enums/wallet-transaction-source.enum.js';
import { WalletTransactionType } from '../common/enums/wallet-transaction-type.enums.js';

@Entity('wallet_transactions')
export class WalletTransaction extends BaseEntity {

  @Index() 
  @Column({ name: 'wallet_id' }) 
  walletId!: string;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'wallet_id' }) 
  wallet!: Wallet;

  @Index({ unique: true }) 
  @Column() 
  reference!: string;

  @Column({ type: 'enum', enum: WalletTransactionType }) 
  type!: WalletTransactionType;

  @Column({ type: 'enum', enum: WalletTransactionSource }) 
  source!: WalletTransactionSource;

  @Column({ type: 'decimal', precision: 15, scale: 2 }) 
  amount!: number;

  @Column({ name: 'balance_before', type: 'decimal', precision: 15, scale: 2 }) 
  balanceBefore!: number;

  @Column({ name: 'balance_after', type: 'decimal', precision: 15, scale: 2 }) 
  balanceAfter!: number;

  @Column({ type: 'text', nullable: true }) 
  description?: string;

  @Column({ name: 'related_id', nullable: true }) 
  relatedId?: string;
}
