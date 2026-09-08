import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notification.entity.js";
import { NotificationsService } from "./notifications.service.js";
import { NotificationsController } from "./notifications.controller.js";
import { EmailService } from "./email.service.js";
import { SmsService } from "./sms.service.js";
import { PushService } from "./push.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, SmsService, PushService],
  exports: [NotificationsService],
})
export class NotificationsModule {}







