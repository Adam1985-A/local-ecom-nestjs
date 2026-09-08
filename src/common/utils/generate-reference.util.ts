import { randomBytes } from 'crypto';

export function generateReference(prefix: string): string {
  const timestamp = Date.now();
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}