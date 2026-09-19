import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Public } from '../common/decorator/public.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { VendorsService } from '../vendors/vendors.service.js';

@ApiTags('Products') 
@ApiBearerAuth() 
@Controller('products')

export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly vendorsService: VendorsService) {}

  @Public() 

  @Get() 
  findAll(@Query() q: ProductQueryDto){ 
 return this.productsService.findAll(q);
  }


 @Get('vendor/my-products') 
  @Roles(UserRole.VENDOR)

  async findMyProducts(@CurrentUser('id') userId: string, 
  @Query() q: PaginationQueryDto) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.productsService.findAllForVendor(vendor.id, q);
  }
 
 
 @Public() 
  @Get(':id') 
  findOne(@Param('id', ParseUUIDPipe) id: string) { 
    return this.productsService.findById(id);
   }

  
  @Post() 
  @Roles(UserRole.VENDOR) 
  async create(@CurrentUser('id') userId: string, 
  @Body() dto: CreateProductDto) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.productsService.create(vendor.id, dto);
  }


  @Patch(':id') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)

  update(@Param('id', ParseUUIDPipe) 
  id: string, 
  @CurrentUser('id') actorId: string, 
  @CurrentUser('role') 
  actorRole: UserRole, 
  @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto, actorId, actorRole);
  }


  @Delete(':id') 
  @Roles(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, 
  @CurrentUser('id') actorId: string, 
  @CurrentUser('role') 
  actorRole: UserRole) {
    return this.productsService.remove(id, actorId, actorRole);
  }
}
