import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './orders-item.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CartService } from '../cart/cart.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

import { OrderStatus } from '../common/enums/order-status.enum.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { generateReference } from '../common/utils/generate-reference.util.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';
import { BusinessException } from '../common/exception/business.exception.js';

const CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly inventoryService: InventoryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(customerId: string, dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartService.getOrCreateCart(customerId, dto.vendorId);
    if (!cart.items?.length) throw new BusinessException('Your cart is empty');
    const vendor = cart.vendor;
    if (!vendor?.isOpen) throw new BusinessException('This vendor is currently closed');

    await this.inventoryService.deductStock(
      cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    );

    const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    const deliveryFee = 500;
    const discountAmount = 0;
    const total = subtotal + deliveryFee - discountAmount;
    const commissionAmount = (total * Number(vendor.commissionRate)) / 100;

    const order = await this.orderRepository.save(
      this.orderRepository.create({
        reference: generateReference('ORD'),
        customerId, 
        vendorId: dto.vendorId,
        status: OrderStatus.PENDING,
        subtotal, 
        deliveryFee, 
        discountAmount, 
        total, 
        commissionAmount,
        paymentMethod: dto.paymentMethod,
        deliveryAddress: dto.deliveryAddress,
        deliveryCity: dto.deliveryCity,
        deliveryState: dto.deliveryState,
        

        }),

    );

    await this.orderItemRepository.save(
      cart.items.map((i) =>
        this.orderItemRepository.create({
          orderId: order.id,
          productId: i.productId,
          productName: i.product?.name ?? 'Unknown Product',
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          subtotal: i.subtotal,
        }),
      ),
    );

    await this.cartService.clearCart(customerId, dto.vendorId);
    
const createdOrder = await this.findById(order.id);

// Send in-app + email notification
if (createdOrder.customer?.email) {
  await this.notificationsService.orderUpdate(
    customerId,
    createdOrder.customer.email,
    createdOrder.id,
    'Order Placed',
    `Your order ${createdOrder.reference} has been placed successfully and is awaiting payment.`,
  );
}

return createdOrder;
  }

  findAll(
    query: PaginationQueryDto & { customerId?: string; vendorId?: string; status?: OrderStatus },
  ): Promise<PaginatedResult<Order>> {
    const qb = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.vendor', 'vendor');
    if (query.customerId) qb.andWhere('order.customerId = :cid', { cid: query.customerId });
    if (query.vendorId) qb.andWhere('order.vendorId = :vid', { vid: query.vendorId });
    if (query.status) qb.andWhere('order.status = :st', { st: query.status });
    qb.orderBy('order.createdAt', 'DESC');
    return paginate(qb, { 
      page: query.page ?? 1, 
      limit: query.limit ?? 10, 
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },

      relations: {
    items: {
      product: true,
    },
    customer: true,
    vendor: true,
  },

    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, actorId: string, actorRole: UserRole): Promise<Order> {
    const order = await this.findById(id);
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(actorRole);
    const isVendorOwner = actorRole === UserRole.VENDOR && order.vendor?.user?.id === actorId;
    const isCustomer = actorRole === UserRole.CUSTOMER && order.customerId === actorId;
    if (!isAdmin && !isVendorOwner && !isCustomer) throw new ForbiddenException('Not authorized to update this order');
    if (isCustomer && dto.status !== OrderStatus.CANCELLED) throw new ForbiddenException('Customers can only cancel orders');
    if (isCustomer && !CANCELLABLE_STATUSES.includes(order.status))
      throw new BusinessException('Order can no longer be cancelled');

    order.status = dto.status;
    if (dto.vendorNote) order.vendorNote = dto.vendorNote;
    if (dto.cancelledReason) order.cancelledReason = dto.cancelledReason;

    if (dto.status === OrderStatus.CANCELLED) {
      await this.inventoryService.restoreStock(
        order.items.filter((i) => i.productId).map((i) => ({ productId: i.productId!, quantity: i.quantity })),
      );
    }
    return this.orderRepository.save(order);
  }

  async markPaid(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
    const order = await this.findById(orderId);
    order.paymentStatus = paymentStatus;
    if (paymentStatus === PaymentStatus.PAID) order.status = OrderStatus.CONFIRMED;
    return this.orderRepository.save(order);
  }

  /**
   * Internal status transition for trusted callers (e.g. DeliveryService).
   * Bypasses the public actor-role rules since the caller has already
   * validated the actor at its own layer.
   */
  async setStatusInternal(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(orderId);
    order.status = status;
    return this.orderRepository.save(order);
  }
}
