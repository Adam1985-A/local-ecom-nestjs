import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity.js';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { VendorsModule } from '../vendors/vendor.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), VendorsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
