import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RidersService } from './riders.service.js';
import { CreateRiderDto } from './dto/create-rider.dto.js';
import { UpdateRiderLocationDto } from './dto/update-rider-location.dto.js';
import { UpdateRiderStatusDto } from './dto/update-rider-status.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';

@ApiTags('Riders') @ApiBearerAuth() @Controller('riders')

export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Post() 
  @Roles(UserRole.RIDER) 
  create(@CurrentUser('id') userId: string, 
  @Body() dto: CreateRiderDto) {
     return this.ridersService.create(userId, dto);
     }

  @Get('me') 
  @Roles(UserRole.RIDER)
  getMyProfile(@CurrentUser('id') userId: string) {
     return this.ridersService.findByUserId(userId);
     }

  @Patch('me/location') 
  @Roles(UserRole.RIDER) 
  updateLocation(@CurrentUser('id') userId: string, 
  @Body() dto: UpdateRiderLocationDto) { 
    return this.ridersService.updateLocation(userId, dto); 
  }

  @Patch('me/status') 
  @Roles(UserRole.RIDER) 
  updateStatus(@CurrentUser('id') userId: string, 
  @Body() dto: UpdateRiderStatusDto) { 
    return this.ridersService.updateStatus(userId, dto); 
  }

  @Get('available') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  findAvailable() { 
    return this.ridersService.findAvailable(); 
  }

  @Patch(':id/verify') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  verify(@Param('id', ParseUUIDPipe) id: string) { 
    return this.ridersService.verify(id, true); 
  }

  @Patch(':id/suspend') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  suspend(@Param('id', ParseUUIDPipe) id: string) { 
    return this.ridersService.verify(id, false); 
  }
}

