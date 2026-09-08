import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface SendSmsInput {
  to: string;   // E.164 format, e.g. +2348012345678
  body: string;
}

/**
 * SMS channel adapter.
 *
 * Logs the message in development.
 * Swap the stub with:
 *   - Termii  (popular in Nigeria)  https://termii.com
 *   - Twilio                        https://www.twilio.com
 *   - Africa's Talking              https://africastalking.com
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(input: SendSmsInput): Promise<void> {
    this.logger.log("SMS SEND (stub): to=" + input.to + " | " + input.body);
    // TODO: wire up real SMS provider here
  }
}

