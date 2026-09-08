import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Delivery } from "./delivery.entity.js";
import { DeliveryService } from "./delivery.service.js";
import { DeliveryController } from "./delivery.controller.js";
import { RidersModule } from "../riders/riders.module.js";
import { OrdersModule } from "../orders/orders.module.js";
import { WalletModule } from "../wallet/wallet.module.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery]),
    RidersModule,
    OrdersModule,
    WalletModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
