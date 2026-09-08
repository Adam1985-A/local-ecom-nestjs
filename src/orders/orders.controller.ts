import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { OrderStatus } from '../common/enums/order-status.enum.js';
import { VendorsService } from '../vendors/vendors.service.js';

@ApiTags('Orders') @ApiBearerAuth() @Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly vendorsService: VendorsService) {}

  @Post() @Roles(UserRole.CUSTOMER)
  create(@CurrentUser('id') userId: string, 
  @Body() dto: CreateOrderDto) { return this.ordersService.create(userId, dto);
    
   }

  @Get('my-orders') @Roles(UserRole.CUSTOMER)
  getMyOrders(@CurrentUser('id') userId: string, 
  @Query() q: PaginationQueryDto, 
  @Query('status') status?: OrderStatus) {
    return this.ordersService.findAll({ 
      ...q, 
      customerId: userId, 
      ...(status !== undefined && { status }), 
    });
  }

  @Get('vendor/orders') @Roles(UserRole.VENDOR)
  async getVendorOrders(@CurrentUser('id') userId: string, 
  @Query() q: PaginationQueryDto, 
  @Query('status') status?: OrderStatus) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.ordersService.findAll({ 
      ...q, 
      vendorId: vendor.id, 
      ...(status !== undefined && { status }),
      });
  }

  @Get() @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query() q: PaginationQueryDto, 
  @Query('status') status?: OrderStatus, 
  @Query('vendorId') vendorId?: string, 
  @Query('customerId') customerId?: string) {
    return this.ordersService.findAll({ 
    ...q, 
    ...(status !== undefined && { status }),
    ...(vendorId !== undefined && { vendorId }),
    ...(customerId !== undefined && { customerId }),
   });
  }

  @Get(':id') 
  findOne(@Param('id', ParseUUIDPipe) id: string) { 
    return this.ordersService.findById(id); 
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') actorId: string, 
  @CurrentUser('role') actorRole: UserRole, 
  @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto, actorId, actorRole);
  }
}
