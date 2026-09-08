import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { User } from './user.entity.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserRoleDto } from './dto/update-user.role.dto.js';

@ApiTags('Users') @ApiBearerAuth() @Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') 
  getProfile(@CurrentUser() user: User) {
     return { message: 'Profile retrieved', data: user };
     }

  @Patch('me') 
  updateProfile(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto) { 
    return this.usersService.update(id, dto); 
  }

  @Get()
   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
   findAll(@Query() q: PaginationQueryDto) {
     return this.usersService.findAll(q);
     }


  @Get(':id') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
     return this.usersService.findById(id); 
    }


  @Patch(':id/status') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  updateStatus(@Param('id', ParseUUIDPipe) id: string, 
  @Body() dto: UpdateUserStatusDto) { 
    return this.usersService.updateStatus(id, dto); 
  }
  @Patch(':id/role') 
  @Roles(UserRole.SUPER_ADMIN) 
  updateRole(@Param('id', ParseUUIDPipe) id: string,
   @Body() dto: UpdateUserRoleDto) {
     return this.usersService.updateRole(id, dto);
     }


  @Delete(':id') 
  @Roles(UserRole.SUPER_ADMIN) 
  remove(@Param('id', ParseUUIDPipe) id: string) { 
    return this.usersService.remove(id); 
  }
}