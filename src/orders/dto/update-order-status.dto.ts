import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '../../common/enums/order-status.enum.js';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  vendorNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cancelledReason?: string;
}