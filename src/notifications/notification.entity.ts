import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/entities/base.entity.js";
import { User } from "../users/user.entity.js";
import { NotificationType } from "../common/enums/notification-type.enum.js";
import { NotificationChannel } from "../common/enums/notification-channels.enum.js";

@Entity("notifications")
export class Notification extends BaseEntity {
  @Index()
  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "enum", enum: NotificationType })
  type!: NotificationType;

  @Column({ type: "enum", enum: NotificationChannel })
  channel!: NotificationChannel;

  @Column()
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;

  @Column({ name: "sent_at", nullable: true })
  sentAt?: Date;

  /** Points to the resource that triggered this notification (orderId, etc.). */
  @Column({ name: "related_id", nullable: true })
  relatedId?: string;
}
