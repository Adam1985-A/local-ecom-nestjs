import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PaystackInitResponse { authorizationUrl: string; accessCode: string; reference: string; }
export interface PaystackVerifyResponse { status: 'success' | 'failed' | 'abandoned'; reference: string; amount: number; gatewayResponse: string; paidAt?: string; data: Record<string, unknown>; }

@Injectable()
export class PaystackGateway {
  private readonly logger = new Logger(PaystackGateway.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly callbackUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('paystack.baseUrl') ?? 'https://api.paystack.co';
    this.secretKey = this.configService.get<string>('paystack.secretKey') ?? '';
    this.callbackUrl = this.configService.get<string>('paystack.callbackUrl') ?? '';
  }

  async initializeTransaction(email: string, amountNgn: number, reference: string, metadata?: Record<string, unknown>): Promise<PaystackInitResponse> {
    const res = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST', headers: this.headers(),
      body: JSON.stringify({ email, amount: Math.round(amountNgn * 100), reference, callback_url: this.callbackUrl, metadata }),
    });
    const json = await res.json() as Record<string, any>;
    if (!json.status) { this.logger.error('Paystack init failed', json); 
    throw new Error(`Paystack: ${json.message}`);
   }
    return { authorizationUrl: json.data.authorization_url, accessCode: json.data.access_code, reference: json.data.reference };
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    const res = await fetch(`${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`, 
    { headers: this.headers()

     });
    const json = await res.json() as Record<string, any>;

    if (!json.status) { this.logger.error('Paystack verify failed', json); 
    throw new Error(`Paystack: ${json.message}`); 
  }
    const d = json.data as Record<string, any>;
    return { status: d.status, reference: d.reference, amount: d.amount, gatewayResponse: d.gateway_response, paidAt: d.paid_at, data: d };
  }

  private headers(): Record<string, string> {
    return { Authorization: `Bearer ${this.secretKey}`, 'Content-Type': 'application/json' };
  }
}

