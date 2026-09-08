import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import type { Cart } from './cart.entity.js';
import { User } from '../users/user.entity.js';
import { Vendor } from '../vendors/vendor.entity.js';
import type { Product } from '../products/products.entity.js';


@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Column({ name: 'cart_id' }) 
  cartId!: string;

  @ManyToOne('Cart', (cart: Cart) => cart.items, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'cart_id' }) 
  cart!: Relation<Cart>;

  @Column({ name: 'product_id' }) 
  productId!: string;

  @ManyToOne('Product', { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'product_id' }) 
  product!: Relation<Product>;

  @Column({ type: 'int' }) 
  quantity!: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 }) 
  unitPrice!: number;

  get subtotal(): number { 
    return Number(this.unitPrice) * this.quantity; 
  }
}
