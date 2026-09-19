import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import type { CartItem } from './cart-item.entity.js';
import type { User } from '../users/user.entity.js';
import type { Vendor } from '../vendors/vendor.entity.js';
import { Product } from '../products/products.entity.js';

@Entity('carts')
@Index(['userId', 'vendorId'], { unique: true })
export class Cart extends BaseEntity {

  @Column({ name: 'user_id', type: 'uuid' }) 
  userId!: string;

  @ManyToOne('User', { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' }) 
  user!: Relation<User>;

  @Column({ name: 'vendor_id', type: 'uuid' }) 
  vendorId!: string;

  @ManyToOne('Vendor', { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'vendor_id' }) 
  vendor!: Relation<Vendor>;

  @OneToMany('CartItem', (item: CartItem) => item.cart, { cascade: true }) 
  items!: Relation<CartItem[]>;
}

