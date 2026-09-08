import {
  IsBoolean, IsDateString, IsEnum, IsInt, IsNumber,
  IsOptional, IsPositive, IsString, IsUUID, Length, Min
} from "class-validator";
import { CouponType } from "../../common/enums/coupon-type.enum.js";



export class CreateCouponDto {
  @IsString()
  @Length(3, 20)
  code!: string;

  @IsEnum(CouponType)
  type!: CouponType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  discountValue!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minimumOrderAmount?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  usageLimit?: number;

  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  expiresAt!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  orderSubtotal!: number;

}






