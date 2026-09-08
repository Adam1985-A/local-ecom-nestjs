import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { Order } from '../orders/order.entity.js';
import { Rider } from '../riders/rider.entity.js';
import { DeliveryStatus } from '../common/enums/delivery-status.enum.js';

@Entity('deliveries')
export class Delivery extends BaseEntity {

  @Index({ unique: true }) 
  @Column({ name: 'order_id' }) 
  orderId!: string;

  @OneToOne(() => Order, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'order_id' }) 
  order!: Order;

  @Index() 
  @Column({ name: 'rider_id', nullable: true }) 
  riderId?: string;

  @ManyToOne(() => Rider, { nullable: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'rider_id' }) 
  rider?: Rider;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING }) 
  status!: DeliveryStatus;

  @Column({ name: 'assigned_at', nullable: true }) 
  assignedAt?: Date;

  @Column({ name: 'picked_up_at', nullable: true }) 
  pickedUpAt?: Date;

  @Column({ name: 'delivered_at', nullable: true }) 
  deliveredAt?: Date;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 12, scale: 2, default: 0 }) 
  deliveryFee!: number;

  @Column({ name: 'rider_earnings', type: 'decimal', precision: 12, scale: 2, default: 0 }) 
  riderEarnings!: number;

  @Column({ name: 'rider_note', type: 'text', nullable: true }) 
  riderNote?: string;

  @Column({ name: 'handover_otp', type: 'varchar',
  length: 6, nullable: true, select: false }) 
  
  handoverOtp!: string | null;
}

  