import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  orderId!: string;

  @IsUUID()
  vendorId!: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
