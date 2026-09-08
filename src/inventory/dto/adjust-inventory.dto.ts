import { IsEnum, IsInt, Min } from 'class-validator';

export enum AdjustmentType {
  RESTOCK = 'RESTOCK',
  DEDUCT = 'DEDUCT',
  SET = 'SET',
}

export class AdjustInventoryDto {
  @IsEnum(AdjustmentType)
  type!: AdjustmentType;

  @IsInt()
  @Min(0)
  quantity!: number;
}