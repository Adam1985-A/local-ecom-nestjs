import { IsLatitude, IsLongitude } from 'class-validator';

export class UpdateRiderLocationDto {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;
}