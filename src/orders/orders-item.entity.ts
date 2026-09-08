import { Column, Entity, Index, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from '../users/user.entity.js';
import { Vendor } from '../vendors/vendor.entity.js';
import type { Order } from './order.entity.js';
import type { Product } from '../products/products.entity.js';
import { OrderStatus } from '../common/enums/order-status.enum.js';
import { PaymentMethod } from '../common/enums/payment-method.enum.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';

@Entity('order_items')
export class OrderItem extends BaseEntity {

  @Column({ name: 'order_id' }) 
  orderId!: string;

  @ManyToOne('Order', (order: Order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' }) 
  order!: Relation<Order>;

  @Column({ name: 'product_id', nullable: true }) 
  productId?: string;

  @ManyToOne('Product', { onDelete: 'SET NULL', nullable: true }) 
  @JoinColumn({ name: 'product_id' }) 
  product?: Relation<Product>;

  @Column({ name: 'product_name' }) 
  productName!: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 }) 
  unitPrice!: number;

  @Column({ type: 'int' }) 
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) 
  subtotal!: number;
}
