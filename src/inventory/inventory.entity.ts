import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { Product } from '../products/products.entity.js';

@Entity('inventory')
export class Inventory extends BaseEntity {
  @Index({ unique: true }) 
  @Column({ name: 'product_id', type: 'uuid' }) 
  productId!: string;

  @OneToOne(() => Product, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'product_id' }) 
  product!: Product;

  @Column({ type: 'int', default: 0 }) 
  quantity!: number;

  @Column({ name: 'low_stock_threshold', type: 'int', default: 5 }) 
  lowStockThreshold!: number;

  @Column({ name: 'is_unlimited', type: 'boolean', default: false }) 
  isUnlimited!: boolean;

  @Column({ name: 'auto_deactivate', type: 'boolean', default: true }) 
  autoDeactivate!: boolean;
}


