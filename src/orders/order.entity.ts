import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import type { User } from '../users/user.entity.js';
import type { Vendor } from '../vendors/vendor.entity.js';
import type { OrderItem } from './orders-item.entity.js';
import { OrderStatus } from '../common/enums/order-status.enum.js';
import { PaymentMethod } from '../common/enums/payment-method.enum.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';

@Entity('orders')
export class Order extends BaseEntity {

  @Index({ unique: true }) 
  @Column({ type: 'varchar', length: 255 }) 
  reference!: string;

  @Index() 
  @Column({ name: 'customer_id', type: 'uuid' }) 
  customerId!: string;

  @ManyToOne('User', { onDelete: 'RESTRICT' }) 
  @JoinColumn({ name: 'customer_id' }) 
  customer!: Relation<User>;

  @Index() 
  @Column({ name: 'vendor_id', type: 'uuid' }) 
  vendorId!: string;

  @ManyToOne('Vendor', { onDelete: 'RESTRICT' }) 
  @JoinColumn({ name: 'vendor_id' }) 
  vendor!:Relation<Vendor>;

  @OneToMany('OrderItem', (item: OrderItem) => item.order, { cascade: true }) 
  items!: Relation<OrderItem[]>;

  @Index() 
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }) 
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) 
  subtotal!: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 12, scale: 2, default: 0 }) 
  deliveryFee!: number;
  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
   discountAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) 
  total!: number;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, default: PaymentMethod.CARD }) 
  paymentMethod!: PaymentMethod;

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) 
  paymentStatus!: PaymentStatus;

  @Column({ name: 'coupon_code', type: 'varchar', nullable: true }) 
  couponCode?: string;

  @Column({ name: 'delivery_address', type: 'varchar' }) 
  deliveryAddress!: string;

  @Column({ name: 'delivery_city', type: 'varchar' }) 
  deliveryCity!: string;

  @Column({ name: 'delivery_state', type: 'varchar' }) 
  deliveryState!: string;

  @Column({ name: 'delivery_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  deliveryLatitude?: number;

  @Column({ name: 'delivery_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  deliveryLongitude?: number;

  @Column({ name: 'customer_note', type: 'text', nullable: true }) 
  customerNote?: string;

  @Column({ name: 'vendor_note', type: 'text', nullable: true }) 
  vendorNote?: string;

  @Column({ name: 'cancelled_reason', type: 'varchar', nullable: true }) 
  cancelledReason?: string;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }) 
  commissionAmount!: number;
}

