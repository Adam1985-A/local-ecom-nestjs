import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {

  @IsString() 
  name!: string;

  @IsUUID() 
  categoryId!: string;

  @IsOptional()
  @IsString() 
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }) 
  @IsPositive() 
  price!: number;

  @IsOptional() 
  @IsNumber({ maxDecimalPlaces: 2 }) 
  @Min(0) 
  discountedPrice?: number;

  @IsOptional() 
  @IsString() 
  imageUrl?: string;

  @IsOptional() 
  @IsString() 
  unit?: string;

  @IsOptional() 
  @IsBoolean() 
  isActive?: boolean;
}


