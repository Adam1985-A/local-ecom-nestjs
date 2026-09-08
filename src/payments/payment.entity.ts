import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { Order } from '../orders/order.entity.js';
import { User } from '../users/user.entity.js';
import { PaymentStatus } from '../common/enums/payment-status.enums.js';
import { PaymentMethod } from '../common/enums/payment-method.enum.js';

@Entity('payments')
export class Payment extends BaseEntity {

  @Index({ unique: true }) 
  @Column() 
  reference!: string;

  @Column({ name: 'gateway_reference', nullable: true }) 
  gatewayReference?: string;

  @Index()
   @Column({ name: 'order_id' }) 
   orderId!: string;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' }) 
  @JoinColumn({ name: 'order_id' }) 
  order!: Order;

  @Index() 
  @Column({ name: 'user_id' }) 
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' }) 
  @JoinColumn({ name: 'user_id' }) 
  user!: User;

  

  @Column({ type: 'decimal', precision: 12, scale: 2 }) 
  amount!: number;

  @Column({ type: 'enum', enum: PaymentMethod }) 
  method!: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) 
  status!: PaymentStatus;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true }) 
  gatewayResponse?: Record<string, unknown>;
  @Column({ name: 'paid_at', nullable: true }) 
  paidAt?: Date;
}
