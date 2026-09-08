import { IsEnum } from 'class-validator';
import { RiderStatus } from '../../common/enums/rider-status.enum.js';

export class UpdateRiderStatusDto {
  @IsEnum(RiderStatus)
  status!: RiderStatus;
}