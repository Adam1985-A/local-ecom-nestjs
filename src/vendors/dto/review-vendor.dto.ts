import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VendorStatus } from '../../common/enums/vendor-status.enum.js';

export class ReviewVendorDto {
  @IsEnum(VendorStatus)
  status!: VendorStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}