import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Wallet } from './wallet.entity.js';
import { WalletTransaction } from './wallet-transaction.entity.js';
import { WalletTransactionSource } from '../common/enums/wallet-transaction-source.enum.js';
import { WalletTransactionType } from '../common/enums/wallet-transaction-type.enums.js';
import { generateReference } from '../common/utils/generate-reference.util.js';
import { BusinessException } from '../common/exception/business.exception.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';

export interface CreditWalletInput {
  userId: string; amount: number; source: WalletTransactionSource; description?: string; relatedId?: string;
}
export interface DebitWalletInput {
  userId: string; amount: number; source: WalletTransactionSource; description?: string; relatedId?: string;
}

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction) private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) wallet = await this.walletRepository.save(this.walletRepository.create({ userId, balance: 0, lockedBalance: 0 }));
    return wallet;
  }

  getBalance(userId: string): Promise<Wallet> { return this.getOrCreateWallet(userId); }

  /**
   * Locks (or creates) the wallet row within an existing transaction.
   * Prevents 404s for first-time users and concurrent creation races.
   */
  private async lockOrCreateWalletForUpdate(manager: EntityManager, userId: string): Promise<Wallet> {
    let wallet = await manager.getRepository(Wallet).createQueryBuilder('w')
      .setLock('pessimistic_write').where('w.userId = :userId', { userId }).getOne();
    if (!wallet) wallet = await manager.getRepository(Wallet).save(
      manager.getRepository(Wallet).create({ userId, balance: 0, lockedBalance: 0 }),
    );
    return wallet;
  }

  async credit(input: CreditWalletInput): Promise<WalletTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.lockOrCreateWalletForUpdate(manager, input.userId);
      const balanceBefore = Number(wallet.balance);
      wallet.balance = balanceBefore + input.amount;
      await manager.getRepository(Wallet).save(wallet);

      const data: Partial<WalletTransaction> = {
  walletId: wallet.id,
  reference: generateReference('WTX'),
  type: WalletTransactionType.CREDIT,
  source: input.source,
  amount: input.amount,
  balanceBefore,
  balanceAfter: Number(wallet.balance),
};

if (input.description !== undefined)
  data.description = input.description;

if (input.relatedId !== undefined)
  data.relatedId = input.relatedId;

const transaction = manager
  .getRepository(WalletTransaction)
  .create(data);

return manager.getRepository(WalletTransaction).save(transaction);
    });
  }

  async debit(input: DebitWalletInput): Promise<WalletTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.lockOrCreateWalletForUpdate(manager, input.userId);
      const balanceBefore = Number(wallet.balance);
      if (balanceBefore < input.amount)
        throw new BusinessException(`Insufficient wallet balance. Available: ₦${balanceBefore.toFixed(2)}`);
      wallet.balance = balanceBefore - input.amount;
      await manager.getRepository(Wallet).save(wallet);

      const transactionData: Partial<WalletTransaction> = {


          walletId: wallet.id, 
          reference: generateReference('WTX'),
          type: WalletTransactionType.DEBIT, 
          source: input.source,
          amount: input.amount, 
          balanceBefore, balanceAfter: Number(wallet.balance),
          
     };
     
     if (input.description !== undefined) {
  transactionData.description = input.description;
}

if (input.relatedId !== undefined) {
  transactionData.relatedId = input.relatedId;
}

const transaction = manager
  .getRepository(WalletTransaction)
  .create(transactionData);

return manager.getRepository(WalletTransaction).save(transaction);
      
    });
  };

  fundWallet(userId: string, amount: number): Promise<WalletTransaction> {
    return this.credit({ userId, amount, source: WalletTransactionSource.WALLET_FUNDING, description: 'Wallet funding' });
  }

  getTransactions(userId: string, query: PaginationQueryDto): Promise<PaginatedResult<WalletTransaction>> {
    const qb = this.transactionRepository.createQueryBuilder('tx')
      .innerJoin('tx.wallet', 'wallet').where('wallet.userId = :userId', { userId }).orderBy('tx.createdAt', 'DESC');
    
    return paginate(qb, {
      ...(query.page !== undefined && { page: query.page }),
      ...(query.limit !== undefined && { limit: query.limit }),
      });
  }
}
