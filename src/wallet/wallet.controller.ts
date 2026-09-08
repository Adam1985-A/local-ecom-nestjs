import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service.js';
import { FundWalletDto } from './dto/fund-wallet.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';

@ApiTags('Wallet') 
@ApiBearerAuth() 
@Controller('wallet')

export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance') 
  getBalance(@CurrentUser('id') userId: string) { 
    return this.walletService.getBalance(userId);
   }

  @Post('fund') 
  fundWallet(@CurrentUser('id') userId: string, 
  @Body() dto: FundWalletDto) {
     return this.walletService.fundWallet(userId, dto.amount);
     }
  @Get('transactions') 
  getTransactions(@CurrentUser('id') userId: string,
   @Query() q: PaginationQueryDto) { 
    
    return this.walletService.getTransactions(userId, q);
   }
}

