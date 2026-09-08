
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';

@ApiTags('Cart') @ApiBearerAuth() @Controller('cart') @Roles(UserRole.CUSTOMER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get() 
  getCart(@CurrentUser('id') userId: string) { 
    return this.cartService.getCart(userId);
   }


  @Post('items') 
  addItem(@CurrentUser('id') userId: string, 
  @Body() dto: AddToCartDto) { 
    return this.cartService.addItem(userId, dto);
   }


  @Patch('items/:itemId') 
  updateItem(@CurrentUser('id') userId: string, 
  @Param('itemId', ParseUUIDPipe) itemId: string, 
  @Body() dto: UpdateCartItemDto) { 
    return this.cartService.updateItem(userId, itemId, dto);
   }
  @Delete('vendor/:vendorId') 
  clearCart(@CurrentUser('id') userId: string, 
  @Param('vendorId', ParseUUIDPipe) vendorId: string) { 
    return this.cartService.clearCart(userId, vendorId); 
  }
}

