import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity.js";
import { EmailService } from "./email.service.js";
import { SmsService } from "./sms.service.js";
import { PushService } from "./push.service.js";
import { NotificationType } from "../common/enums/notification-type.enum.js";
import { NotificationChannel } from "../common/enums/notification-channels.enum.js";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto.js";
import { paginate } from "../common/utils/pagination.util.js";
import type { PaginatedResult } from "../common/type/pagination.types.js";

export interface SendNotificationInput {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  title: string;
  body: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  metadata?: Record<string, unknown>;
  relatedId?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly pushService: PushService,
  ) {}

  async send(input: SendNotificationInput): Promise<void> {
    const { userId, type, channels, title, body, email, phone, deviceToken, metadata, relatedId } = input;

    await Promise.allSettled(
      channels.map(async (channel) => {
        try {
          if (channel === NotificationChannel.EMAIL && email) {
            await this.emailService.send({ to: email, subject: title, body });
          } else if (channel === NotificationChannel.SMS && phone) {
            await this.smsService.send({ to: phone, body: title + ": " + body });
          } else if (channel === NotificationChannel.PUSH && deviceToken) {
            await this.pushService.send({ deviceToken, title, body });
          }

          await this.notificationRepository.save(
            this.notificationRepository.create({
              userId, 
              type, 
              channel, 
              title, 
              body, 
              sentAt: new Date(),
              ...(metadata !== undefined && { metadata }),
              ...(relatedId !== undefined && { relatedId }),
            }),
          );
        } catch (err) {
          this.logger.error(
            "Failed to send " + channel + " notification to user " + userId + ": " + (err as Error).message,
          );
        }
      }),
    );
  }

  // ── Convenience helpers ────────────────────────────────────────────

  orderUpdate(userId: string, email: string, orderId: string, title: string, body: string) {
    return this.send({
      userId, type: NotificationType.ORDER_UPDATE, relatedId: orderId,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      title, body, email,
    });
  }

  paymentConfirmation(userId: string, email: string, orderId: string, amount: number) {
    return this.send({
      userId, type: NotificationType.PAYMENT, relatedId: orderId,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      title: "Payment Confirmed",
      body: "Your payment of N" + amount.toFixed(2) + " has been confirmed.",
      email,
    });
  }

  lowStockAlert(userId: string, email: string, productName: string) {
    return this.send({
      userId, type: NotificationType.SYSTEM,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      title: "Low Stock Alert",
      body: '"' + productName + '" is running low on stock.',
      email,
    });
  }

  // ── User-facing API ────────────────────────────────────────────────

  findAll(userId: string, query: PaginationQueryDto): Promise<PaginatedResult<Notification>> {
    const qb = this.notificationRepository
      .createQueryBuilder("n")
      .where("n.userId = :userId", { userId })
      .andWhere("n.channel = :channel", { channel: NotificationChannel.IN_APP })
      .orderBy("n.createdAt", "DESC");
    return paginate(qb, { 
      page: query.page ?? 1, 
      limit: query.limit ?? 10, 
    });
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id, userId } });
    if (!notification) throw new NotFoundException("Notification not found");
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
  }

  countUnread(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false, channel: NotificationChannel.IN_APP },
    });
  }
}


