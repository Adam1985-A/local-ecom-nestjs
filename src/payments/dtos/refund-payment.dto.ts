import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class RefundPaymentDto {
  @IsUUID()
  paymentId!: string;

  /**
   * Amount to refund in NGN.
   * Omit this field to refund the full original payment amount.
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}