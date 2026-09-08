import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupon } from "./coupon.entity.js";
import { PromotionsService } from "./promotions.service.js";
import { PromotionsController } from "./promotions.controller.js";

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
