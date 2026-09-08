import { IsLatitude, IsLongitude, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsBoolean } from 'class-validator';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user.role.enum.js';

export class UpdateUserDto {

  @IsOptional() 
  @IsString() 
  @Length(2,50) 
  firstName?: string;

  @IsOptional() 
  @IsString() 
  @Length(2,50) 
  lastName?: string;

  @IsOptional() 
  @Matches(/^\+?[0-9]{10,15}$/) 
  phone?: string;

  @IsOptional() 
  @IsString() 
  avatarUrl?: string;

  @IsOptional() 
  @IsString() 
  address?: string;

  @IsOptional() 
  @IsString() 
  city?: string;

  @IsOptional() 
  @IsString() 
  state?: string;

  @IsOptional() 
  @IsLatitude() 
  latitude?: number;

  @IsOptional() 
  @IsLongitude() 
  longitude?: number;

  @IsBoolean() 
  isActive!: boolean; 

  @IsEnum(UserRole) 
  role!: UserRole;
}






