
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service.js';
import { CreateInventoryDto } from './dto/create-inventory.dto.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';
import { UpdateInventoryDto } from './dto/update-inventory.dto.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { VendorsService } from '../vendors/vendors.service.js';

@ApiTags('Inventory') 
@ApiBearerAuth() 
@Controller('inventory')

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService, private readonly vendorsService: VendorsService) {}


  @Post() 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) 

  create(@Body() dto: CreateInventoryDto) { 
    return this.inventoryService.create(dto); 
  }

  @Get('low-stock') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)

  async getLowStock(@CurrentUser('id') userId: string, 
  @CurrentUser('role') role: UserRole) {

    let vendorId: string | undefined;
    if (role === UserRole.VENDOR) {
       const v = await this.vendorsService.findByUserId(userId); 
       vendorId = v.id;
       }
    return this.inventoryService.findLowStock(vendorId);

  }

  @Get('product/:productId') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
     return this.inventoryService.findByProductId(productId); 
    }
  @Patch(':id') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  update(@Param('id', ParseUUIDPipe) id: string, 
  @Body() dto: UpdateInventoryDto) {
     return this.inventoryService.update(id, dto); 
    }
  @Post('product/:productId/adjust') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) 
  adjust(@Param('productId', ParseUUIDPipe) productId: string,
   @Body() dto: AdjustInventoryDto) { 
    return this.inventoryService.adjust(productId, dto); 
  }
}


