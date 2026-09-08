import { registerAs } from '@nestjs/config';

export default registerAs('paystack', () => ({
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  baseUrl: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
  callbackUrl:
    process.env.PAYSTACK_CALLBACK_URL ||
    'http://localhost:3000/api/v1/payments/paystack/callback',
}));
