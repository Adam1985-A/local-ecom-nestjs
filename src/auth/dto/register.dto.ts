import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/user.role.enum.js';

export const SELF_REGISTERABLE_ROLES = [UserRole.CUSTOMER, UserRole.VENDOR, UserRole.RIDER];

export class RegisterDto {
  @IsEmail() 
  email!: string;
   
  @MinLength(8) 
  password!: string;

  @IsString() 
  firstName!: string;

  @IsString() 
  lastName!: string;

  @IsOptional() 
  @Matches(/^\+?[0-9]{10,15}$/) 
  phone?: string;


  @IsOptional() 
  @IsEnum(SELF_REGISTERABLE_ROLES) 
  role?: UserRole;
}


export class RefreshTokenDto { 
  @IsString() 
  refreshToken!: string;
 }





