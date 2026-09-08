import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidateCouponDto {
  @IsString()
  code!: string;

  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderSubtotal!: number;
}