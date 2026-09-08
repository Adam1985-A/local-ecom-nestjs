import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Order } from '../orders/order.entity.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { OrderStatus } from '../common/enums/order-status.enum.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';

/**
 * Cancels PENDING + unpaid orders older than 30 minutes.
 * Restores inventory so the stock is available for other customers.
 * Runs every 5 minutes.
 */
@Injectable()
export class OrderExpirationJob {
  private readonly logger = new Logger(OrderExpirationJob.name);
  private readonly EXPIRY_MINUTES = 30;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly inventoryService: InventoryService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async run(): Promise<void> {
    this.logger.debug('Running order expiration check...');

    const expiryTime = new Date(Date.now() - this.EXPIRY_MINUTES * 60 * 1000);

    const expiredOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: LessThan(expiryTime),
      },
      relations: {
        items: true, 
      },
    });

    if (!expiredOrders.length) return;

    this.logger.log(`Expiring ${expiredOrders.length} unpaid order(s)...`);

    for (const order of expiredOrders) {
      try {
        order.status = OrderStatus.CANCELLED;
        order.cancelledReason = `Auto-cancelled: payment not received within ${this.EXPIRY_MINUTES} minutes`;
        await this.orderRepository.save(order);

        if (order.items?.length) {
          await this.inventoryService.restoreStock(
            order.items
              .filter((i) => i.productId)
              .map((i) => ({ productId: i.productId!, quantity: i.quantity })),
          );
        }

        this.logger.log(`Order ${order.reference} expired and cancelled`);
      } catch (err) {
        this.logger.error(
          `Failed to expire order ${order.reference}: ${(err as Error).message}`,
        );
      }
    }
  }
}
