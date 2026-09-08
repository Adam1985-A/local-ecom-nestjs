import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity.js';
import { CartItem } from './cart-item.entity.js';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}