import { IsObject, IsString } from 'class-validator';

/**
 * Shape of the payload Paystack sends to our webhook endpoint.
 * Only the fields we actually act on are declared here.
 */
export class PaystackWebhookDto {
  /** e.g. "charge.success" | "transfer.success" | "refund.failed" */
  @IsString()
  event!: string;

  @IsObject()
  data!: Record<string, unknown>;
}