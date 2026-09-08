import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VendorsService } from './vendors.service.js';
import { CreateVendorDto } from './dto/create-vendor.dto.js';
import { UpdateVendorDto } from './dto/update-vendor.dto.js';
import { ReviewVendorDto } from './dto/review-vendor.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Public } from '../common/decorator/public.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { BusinessType } from '../common/enums/business-type.enum.js';
import { VendorStatus } from '../common/enums/vendor-status.enum.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';

@ApiTags('Vendors') @ApiBearerAuth() @Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Public() @Get() 
  findAllActive(@Query() q: PaginationQueryDto, 
  @Query('businessType') bt?: BusinessType, 
  @Query('city') city?: string) {

    return this.vendorsService.findAllActive({
  ...q,
  ...(bt !== undefined && { businessType: bt }),
  ...(city !== undefined && { city }),
});
  }

  @Public() 
  @Get(':id') 
  findOne(@Param('id', ParseUUIDPipe) id: string) { 
    return this.vendorsService.findById(id); 
  }

  @Post() 
  @Roles(UserRole.VENDOR) 
  create(@CurrentUser('id') userId: string, 
  @Body() dto: CreateVendorDto) { 
    return this.vendorsService.create(userId, dto);
   }

  @Get('me/profile')
   @Roles(UserRole.VENDOR) 
   getMyProfile(@CurrentUser('id') userId: string) { 
    return this.vendorsService.findByUserId(userId); 
  }
  @Patch('me/profile') 
  @Roles(UserRole.VENDOR)
   async updateMyProfile(@CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
     @Body() dto: UpdateVendorDto) {
    const v = await this.vendorsService.findByUserId(userId);
    return this.vendorsService.update(v.id, dto, userId, role);
  }

  @Get('admin/all') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  findAllAdmin(@Query() q: PaginationQueryDto, 
  @Query('businessType') bt?: BusinessType,
   @Query('status') status?: VendorStatus, 
   @Query('city') city?: string) {

    return this.vendorsService.findAll({
  ...q,
  ...(bt !== undefined && { businessType: bt }),
  ...(status !== undefined && { status }),
  ...(city !== undefined && { city }),
  });
   }
  
  @Patch(':id/review') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  review(@Param('id', ParseUUIDPipe) id: string, 
  @Body() dto: ReviewVendorDto) {
     return this.vendorsService.review(id, dto);
     }

  @Patch(':id') 
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  update(@Param('id', ParseUUIDPipe) id: string, 
  @CurrentUser('id') actorId: string, 
  @CurrentUser('role') actorRole: UserRole, 
  @Body() dto: UpdateVendorDto) { 
    return this.vendorsService.update(id, dto, actorId, actorRole);
   }

  @Delete(':id')
   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
   remove(@Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') actorId: string, 
    @CurrentUser('role') actorRole: UserRole) { 
      return this.vendorsService.remove(id, actorId, actorRole); 
    }
}