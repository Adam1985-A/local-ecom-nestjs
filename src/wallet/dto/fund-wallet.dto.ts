import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class FundWalletDto { @IsNumber({ maxDecimalPlaces: 2 }) 
@IsPositive() 
amount!: number; }

export class WalletTransferDto {
  @IsUUID() 
  recipientUserId!: string;

  @IsNumber({ maxDecimalPlaces: 2 }) 
  @IsPositive() 
  amount!: number;

  @IsOptional() 
  @IsString() 
  description?: string;
}