import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from './rider.entity.js';
import { RidersService } from './riders.service.js';
import { RidersController } from './riders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rider])],
  controllers: [RidersController],
  providers: [RidersService],
  exports: [RidersService],
})
export class RidersModule {}
