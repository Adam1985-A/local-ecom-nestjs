import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import type { Product } from '../products/products.entity.js';
import { Cart } from '../cart/cart.entity.js';
import { BaseEntity } from '../common/entities/base.entity.js';
import { BusinessType } from '../common/enums/business-type.enum.js';
import { VendorStatus } from '../common/enums/vendor-status.enum.js';
import type { Relation } from 'typeorm';
import type { User } from '../users/user.entity.js';

@Entity('vendors')
export class Vendor extends BaseEntity {
  @Index({ unique: true }) 
  @Column({ type: 'uuid', name: 'user_id' })
   userId!: string;

  @ManyToOne('User', { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' })
   user!: Relation<User>;

  @OneToMany( 'Product', (product: Product) => product.vendor)
  products! : Relation<Product[]>;

  @OneToMany('Cart', (cart: Cart) => cart.vendor)
  carts! : Relation<Cart[]>;


  @Column({ type: 'varchar', name: 'business_name' }) 
  businessName!: string;

  @Index()
   @Column({ name: 'business_type', type: 'enum', enum: BusinessType }) 
   businessType!: BusinessType;

  @Column({ type: 'text', nullable: true })
   description?: string;

  @Column({ type: 'varchar', name: 'logo_url', nullable: true })
   logoUrl?: string;

  @Column({ type: 'varchar', name: 'cover_image_url', nullable: true }) 
  coverImageUrl?: string;

  @Column({ type: 'varchar'}) 
  phone!: string;

  @Column({ type: 'varchar'}) 
  address!: string;

  @Column({ type: 'varchar'}) 
  city!: string;

  @Column({ type: 'varchar'}) 
  state!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  longitude?: number;

  @Index()
   @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.PENDING }) 
   status!: VendorStatus;

  @Column({ type: 'text', name: 'rejection_reason', nullable: true }) 
  rejectionReason?: string | null = null;

  @Column({ type: 'boolean', name: 'is_open', default: true }) 
  isOpen!: boolean;

  @Column({ name: 'opening_time', type: 'time', nullable: true }) 
  openingTime?: string;

  @Column({ name: 'closing_time', type: 'time', nullable: true }) 
  closingTime?: string;

  @Column({ name: 'minimum_order_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }) 
  minimumOrderAmount!: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 10 })
   commissionRate!: number;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0 }) 
  averageRating!: number

  @Column({ name: 'total_reviews', default: 0 }) 
  totalReviews!: number;
}