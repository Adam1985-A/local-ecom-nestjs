import { Module, RequestMethod } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import appConfig from '../config/app.config.js';
import databaseConfig from '../config/database.config.js';
import jwtConfig from '../config/jwt.config.js';
import paystackConfig from '../config/paystack.config.js';
import redisConfig from '../config/redis.config.js';
import cloudinaryConfig from '../config/cloudinary.config.js';

import { RequestIdMiddleware } from '../common/middleware/request-id.middleware.js';
import { HealthModule } from './health.module.js';

import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { VendorsModule } from '../vendors/vendor.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { ProductsModule } from '../products/products.module.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { CartModule } from '../cart/cart.module.js';
import { OrdersModule } from '../orders/orders.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { DeliveryModule } from '../delivery/delivery.modules.js';
import { RidersModule } from '../riders/riders.module.js';
import { WalletModule } from '../wallet/wallet.module.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { PromotionsModule } from '../promotion/promotions.module.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';

import { OrderExpirationJob } from '../jobs/orders-expiration.job.js';
import { InventorySyncJob } from '../jobs/inventory.sync.job.js';
import { NotificationJob } from '../jobs/notification.job.js';

import { Order } from '../orders/order.entity.js';
import { Inventory } from '../inventory/inventory.entity.js';
import { Product } from '../products/products.entity.js';
import { Notification } from '../notifications/notification.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, paystackConfig, redisConfig, cloudinaryConfig],
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => 
      cs.get<TypeOrmModuleOptions>('database')!, 
    }),

    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    TypeOrmModule.forFeature([Order, Inventory, Product, Notification]),

    HealthModule,
    AuthModule,
    UsersModule,
    VendorsModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    DeliveryModule,
    RidersModule,
    WalletModule,
    ReviewsModule,
    NotificationsModule,
    PromotionsModule,
    AnalyticsModule,
  ],
  providers: [OrderExpirationJob, InventorySyncJob, NotificationJob],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}