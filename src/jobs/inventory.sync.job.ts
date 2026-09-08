import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../inventory/inventory.entity.js';
import { Product } from '../products/products.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../common/enums/notification-type.enum.js';
import { NotificationChannel } from '../common/enums/notification-channels.enum.js';

/**
 * Runs every hour:
 *  1. Deactivates products that have hit zero stock (if autoDeactivate is on).
 *  2. Sends low-stock alert notifications to vendor owners.
 */
@Injectable()
export class InventorySyncJob {
  private readonly logger = new Logger(InventorySyncJob.name);

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async run(): Promise<void> {
    this.logger.debug('Running inventory sync...');
    await Promise.all([
      this.deactivateOutOfStockProducts(),
      this.sendLowStockAlerts(),
    ]);
  }

  private async deactivateOutOfStockProducts(): Promise<void> {
    const zeroStock = await this.inventoryRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'product')
      .where('inv.quantity <= 0')
      .andWhere('inv.isUnlimited = false')
      .andWhere('inv.autoDeactivate = true')
      .andWhere('product.isActive = true')
      .getMany();

    for (const inv of zeroStock) {
      try {
        await this.productRepository.update(inv.productId, { isActive: false });
        this.logger.log(
          `Product "${inv.product?.name}" (${inv.productId}) deactivated – out of stock`,
        );
      } catch (err) {
        this.logger.error(
          `Failed to deactivate product ${inv.productId}: ${(err as Error).message}`,
        );
      }
    }
  }

  private async sendLowStockAlerts(): Promise<void> {
    const lowStock = await this.inventoryRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .where('inv.isUnlimited = false')
      .andWhere('inv.quantity > 0')
      .andWhere('inv.quantity <= inv.lowStockThreshold')
      .andWhere('inv.lowStockThreshold > 0')
      .getMany();

    for (const inv of lowStock) {
      const owner = inv.product?.vendor?.user;
      if (!owner) continue;

      try {
        await this.notificationsService.send({
          userId: owner.id,
          email: owner.email,
          type: NotificationType.SYSTEM,
          channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
          title: 'Low Stock Alert',
          body: `"${inv.product.name}" has only ${inv.quantity} unit(s) left (threshold: ${inv.lowStockThreshold}).`,
          relatedId: inv.productId,
        });
      } catch (err) {
        this.logger.error(
          `Failed to send low-stock alert for product ${inv.productId}: ${(err as Error).message}`,
        );
      }
    }
  }
}
