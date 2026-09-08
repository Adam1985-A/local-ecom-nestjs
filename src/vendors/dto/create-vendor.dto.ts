import { IsEnum, IsLatitude, IsLongitude, IsOptional, IsString, Matches } from 'class-validator';
import { BusinessType } from '../../common/enums/business-type.enum.js';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, Min } from 'class-validator';


export class CreateVendorDto {

  @IsString() 
  businessName!: string;

  @IsEnum(BusinessType) 
  businessType!: BusinessType;

  @IsOptional() 
  @IsString() 
  description?: string;

  @Matches(/^\+?[0-9]{10,15}$/) 
  phone!: string;

  @IsString() 
  address!: string;

  @IsString() 
  city!: string;

  @IsString() 
  state!: string;

  @IsOptional() 
  @IsLatitude() 
  latitude?: number;

  @IsOptional() 
  @IsLongitude() 
  longitude?: number;

  @IsOptional() 
  @IsString() 
  openingTime?: string;

  @IsOptional() 
  @IsString() 
  closingTime?: string;

  @IsOptional()
   @IsBoolean() 
   isOpen?: boolean;

  @IsOptional() 
  @IsNumber() 
  @Min(0) 
  minimumOrderAmount?: number;
}


