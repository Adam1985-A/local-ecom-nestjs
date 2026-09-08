import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { PaystackGateway } from './paystack.gateway.js';
import { OrdersModule } from '../orders/orders.module.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { DeliveryModule } from '../delivery/delivery.modules.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), 
  OrdersModule, 
  WalletModule,
  DeliveryModule,
  NotificationsModule, 
],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackGateway],
  exports: [PaymentsService],
})
export class PaymentsModule {}
