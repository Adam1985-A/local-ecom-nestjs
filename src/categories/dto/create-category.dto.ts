import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { BusinessType } from '../../common/enums/business-type.enum.js';
import { PartialType } from '@nestjs/mapped-types';


export class CreateCategoryDto {
  @IsString() 
  name!: string;

  @IsEnum(BusinessType) 
  businessType!: BusinessType;

  @IsOptional() 
  @IsString() 
  description?: string;

  @IsOptional() 
  @IsString() 
  iconUrl?: string;

  @IsOptional()
   @IsUUID() 
   parentId?: string;

  @IsOptional() 
  @IsNumber() 
  @Min(0) 
  sortOrder?: number;

  @IsOptional() 
  @IsBoolean() 
  isActive?: boolean;
}



