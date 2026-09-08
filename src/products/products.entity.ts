import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { CartItem } from '../cart/cart-item.entity.js';
import { BaseEntity } from '../common/entities/base.entity.js';
import type { Vendor } from '../vendors/vendor.entity.js';
import { Category } from '../categories/category.entity.js';

@Entity('products')
export class Product extends BaseEntity {

  @Index() 
  @Column({ name: 'vendor_id' }) 
  vendorId!: string;

  @ManyToOne( 'Vendor', { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'vendor_id' }) 
  vendor!: Relation<Vendor>;

  @Column({ name: 'category_id' }) 
  categoryId!: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' }) 
  @JoinColumn({ name: 'category_id' }) 
  category!: Category;

  @OneToMany(() => CartItem, (item) => item.product)
    cartItems! : CartItem[];

  @Column() 
  name!: string;

  @Index({ unique: true }) 
  @Column() 
  slug!: string;

  @Column({ type: 'text', nullable: true }) 
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) 
  price!: number;

  @Column({ name: 'discounted_price', type: 'decimal', precision: 12, scale: 2, nullable: true }) 
  discountedPrice?: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ name: 'image_public_id', nullable: true }) 
  imagePublicId?: string;

  @Column({ nullable: true }) 
  unit?: string;

  @Column({ name: 'is_active', default: true }) 
  isActive!: boolean;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 }) 
  averageRating!: number;

  @Column({ name: 'total_reviews', default: 0 }) 
  totalReviews!: number;

  get effectivePrice(): number {
    return this.discountedPrice !== undefined && this.discountedPrice !== null ? 
    Number(this.discountedPrice) : Number(this.price);
  }
}
