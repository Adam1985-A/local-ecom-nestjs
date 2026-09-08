import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

/**
 * Email channel adapter.
 *
 * Currently logs the email to the console (development).
 * Replace the body of `send()` with your preferred driver:
 *   - Nodemailer (SMTP) via @nestjs-modules/mailer
 *   - SendGrid  via @sendgrid/mail
 *   - Mailgun   via mailgun.js
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(input: SendEmailInput): Promise<void> {
    this.logger.log(
      "EMAIL SEND (stub): to=" + input.to + " subject=" + input.subject,
    );
    // TODO: wire up real SMTP / transactional email provider here
  }
}





