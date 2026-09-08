import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './orders-item.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

import { CartModule } from '../cart/cart.module.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { VendorsModule } from '../vendors/vendor.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), 
  CartModule, 
  InventoryModule, 
  VendorsModule,
  NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
