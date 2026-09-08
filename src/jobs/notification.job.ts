import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Notification } from '../notifications/notification.entity.js';

/**
 * Runs daily at midnight to keep the notifications table lean:
 *  - Deletes read in-app notifications older than 90 days.
 *  - Deletes unread notifications older than 180 days (effectively orphaned).
 */
@Injectable()
export class NotificationJob {
  private readonly logger = new Logger(NotificationJob.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanup(): Promise<void> {
    this.logger.debug('Running notification cleanup...');

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oneEightyDaysAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    const [readResult, unreadResult] = await Promise.allSettled([
      this.notificationRepository.delete({
        isRead: true,
        createdAt: LessThan(ninetyDaysAgo),
      }),
      this.notificationRepository.delete({
        isRead: false,
        createdAt: LessThan(oneEightyDaysAgo),
      }),
    ]);

    if (readResult.status === 'fulfilled') {
      this.logger.log(
        `Deleted ${readResult.value.affected ?? 0} old read notifications`,
      );
    } else {
      this.logger.error('Failed to clean read notifications', readResult.reason);
    }

    if (unreadResult.status === 'fulfilled') {
      this.logger.log(
        `Deleted ${unreadResult.value.affected ?? 0} stale unread notifications`,
      );
    } else {
      this.logger.error('Failed to clean unread notifications', unreadResult.reason);
    }
  }
}
