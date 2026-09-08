import { IsInt, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  vendorId!: string;

  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
