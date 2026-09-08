import { IsString, Length } from 'class-validator';

export class ConfirmDeliveryDto { 
  @IsString() 
  @Length(4, 6) 
  otp!: string; 
}
