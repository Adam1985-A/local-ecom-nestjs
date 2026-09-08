import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity.js";
import { ReviewsService } from "./reviews.service.js";
import { ReviewsController } from "./reviews.controller.js";
import { VendorsModule } from "../vendors/vendor.module.js";
import { ProductsModule } from "../products/products.module.js";
import { OrdersModule } from "../orders/orders.module.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    VendorsModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}



