import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity.js';
import { PaystackGateway } from './paystack.gateway.js';
import { OrdersService } from '../orders/orders.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PaymentMethod } from '../common/enums/payment-method.enum.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';
import { WalletTransactionSource } from '../common/enums/wallet-transaction-source.enum.js';
import { generateReference } from '../common/utils/generate-reference.util.js';
import { BusinessException } from '../common/exception/business.exception.js';
import { User } from '../users/user.entity.js';
import { DeliveryService } from '../delivery/delivery.service.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) 
    private readonly paymentRepository: Repository<Payment>,
    private readonly paystackGateway: PaystackGateway,
    private readonly ordersService: OrdersService,
    private readonly walletService: WalletService,
    private readonly deliveryService: DeliveryService,
    private readonly notificationsService: NotificationsService,

  ) {}

  async initiatePayment(orderId: string, user: User): Promise<{ authorizationUrl?: string; message: string; payment: Payment }> {
    const order = await this.ordersService.findById(orderId);

      await this.deliveryService.createForOrder(
        orderId,
        Number(order.deliveryFee),
      );

    if (order.paymentStatus === PaymentStatus.PAID) 
      throw new BusinessException('This order has already been paid for');

    const reference = generateReference('PAY');

    if (order.paymentMethod === PaymentMethod.WALLET) {
      await this.walletService.debit({
        userId: user.id, amount: Number(order.total),
        source: WalletTransactionSource.ORDER_PAYMENT,
        description: `Payment for order ${order.reference}`, relatedId: order.id,
      });
      const payment = await this.paymentRepository.save(this.paymentRepository.create({
        reference, orderId, userId: user.id, amount: order.total,
        method: PaymentMethod.WALLET, status: PaymentStatus.PAID, paidAt: new Date(),
      }));
      await this.ordersService.markPaid(orderId, PaymentStatus.PAID);

     await this.deliveryService.createForOrder(
     orderId,
    Number(order.total),
    ); 

await this.notificationsService.paymentConfirmation(
  user.id,
  user.email,
  orderId,
  Number(order.total),
);

return { message: 'Payment successful', payment };
    }

    const paystackInit = await this.paystackGateway.initializeTransaction(
      user.email, Number(order.total), reference, { orderId, orderReference: order.reference },
    );
    const payment = await this.paymentRepository.save(this.paymentRepository.create({
      reference, gatewayReference: paystackInit.reference, orderId, userId: user.id,
      amount: order.total, method: order.paymentMethod, status: PaymentStatus.PENDING,
    }));
    return { authorizationUrl: paystackInit.authorizationUrl, message: 'Redirect user to authorizationUrl to complete payment', payment };
  }

  async handlePaystackCallback(reference: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({ 
      where: { gatewayReference: reference } 
    });

    if (!payment){ 
      throw new NotFoundException(`No payment found for Paystack reference ${reference}`

      );
    }

    const result = await this.paystackGateway.verifyTransaction(reference);
    const newStatus = result.status === 'success'
     ? PaymentStatus.PAID 
     : PaymentStatus.FAILED;
    payment.status = newStatus;
    payment.gatewayResponse = result.data;
  

    if (newStatus === PaymentStatus.PAID) {
  payment.paidAt = new Date(result.paidAt ?? Date.now());

    }

await this.paymentRepository.save(payment);

const updatedOrder = await this.ordersService.markPaid(
  payment.orderId,
  newStatus,
);

if (newStatus === PaymentStatus.PAID) {
  const customerEmail = updatedOrder.customer?.email;

  if (customerEmail) {
    await this.notificationsService.paymentConfirmation(
      updatedOrder.customerId,
      customerEmail,
      updatedOrder.id,
      Number(updatedOrder.total),
    );
  }
}
}  

  async verifyAndUpdate(ref: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { reference: ref } 
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.gatewayReference) await this.handlePaystackCallback(payment.gatewayReference);
    const updated = await this.paymentRepository.findOne({ where: { reference: ref } });
    if (!updated) throw new NotFoundException('Payment not found');
    return updated;
  }

  findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.find({ where: { orderId }, order: { createdAt: 'DESC' } });
  }
}
