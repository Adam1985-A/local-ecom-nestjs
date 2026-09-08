import { IsBoolean, IsInt, IsOptional, IsUUID, Min, IsString, IsEnum } from 'class-validator';
import { AdjustmentType } from '../../common/enums/adjustment-type.enum.js';


export class CreateInventoryDto {

  @IsUUID() 
  productId!: string;

  @IsInt() 
  @Min(0) 
  quantity!: number;

  @IsOptional() 
  @IsInt() 
  @Min(0) 
  lowStockThreshold?: number;

  @IsOptional() 
  @IsBoolean() 
  isUnlimited?: boolean;

  @IsOptional() 
  @IsBoolean() 
  autoDeactivate?: boolean;

  @IsOptional() 
  @IsString() 
  reason?: string;

}

  

  

  


