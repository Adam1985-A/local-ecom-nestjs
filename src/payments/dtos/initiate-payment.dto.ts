import { IsEnum, IsUUID } from 'class-validator';
import { PaymentMethod } from '../../common/enums/payment-method.enum.js';

export class InitiatePaymentDto {
  @IsUUID()
  orderId!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}