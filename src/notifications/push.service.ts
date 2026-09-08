import { Injectable, Logger } from "@nestjs/common";

export interface SendPushInput {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Push notification channel adapter.
 *
 * Logs in development.
 * Swap with:
 *   - Firebase Cloud Messaging (FCM) via firebase-admin
 *   - OneSignal                     via @onesignal/node-onesignal
 */
@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async send(input: SendPushInput): Promise<void> {
    this.logger.log(
      "PUSH SEND (stub): token=" + input.deviceToken + " title=" + input.title,
    );
    // TODO: wire up real push provider here
  }
}
