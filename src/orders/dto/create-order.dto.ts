import { IsEnum, IsLatitude, IsLongitude, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../../common/enums/payment-method.enum.js';
import { OrderStatus } from '../../common/enums/order-status.enum.js';

export class CreateOrderDto {
  @IsUUID() 
  vendorId!: string;

  @IsEnum(PaymentMethod) 
  paymentMethod!: PaymentMethod;

  @IsString() 
  deliveryAddress!: string;

  @IsString() 
  deliveryCity!: string;

  @IsString() 
  deliveryState!: string;

  @IsOptional() 
  @IsLatitude() 
  deliveryLatitude?: number;

  @IsOptional() 
  @IsLongitude() 
  deliveryLongitude?: number;

  @IsOptional() 
  @IsString() 
  customerNote?: string;

  @IsOptional() 
  @IsString() 
  couponCode?: string;

   

}

  
 


