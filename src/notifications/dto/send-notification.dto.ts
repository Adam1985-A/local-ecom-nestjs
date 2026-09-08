import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationType } from '../../common/enums/notification-type.enum.js';
import { NotificationChannel } from '../../common/enums/notification-channels.enum.js';

export class SendNotificationDto {
  /** ID of the user who will receive this notification */
  @IsUUID()
  userId!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  /** One or more delivery channels for this notification */
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels!: NotificationChannel[];

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  /** Required when channels includes NotificationChannel.EMAIL */
  @IsOptional()
  @IsString()
  email?: string;

  /** Required when channels includes NotificationChannel.SMS (E.164 format) */
  @IsOptional()
  @IsString()
  phone?: string;

  /** Required when channels includes NotificationChannel.PUSH */
  @IsOptional()
  @IsString()
  deviceToken?: string;

  /** Arbitrary key-value metadata stored alongside the notification record */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  /** UUID of the entity that triggered this notification (order, payment, etc.) */
  @IsOptional()
  @IsUUID()
  relatedId?: string;
}