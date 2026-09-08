import { IsOptional, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';
import { RiderStatus } from '../../common/enums/rider-status.enum.js';
import { IsLatitude, IsLongitude } from 'class-validator';

export class CreateRiderDto {
  @IsString() 
  vehicleType!: string;

  @IsOptional() 
  @IsString() 
  vehiclePlate?: string;

  @IsOptional() 
  @IsString() 
  nin?: string;

  @IsOptional() 
  @IsString() 
  guarantorName?: string;

  @IsOptional() 
  @IsString() 
  guarantorPhone?: string;
  
}




