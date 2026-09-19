import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Cart } from '../cart/cart.entity.js';
import type { Relation } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity.js';
import { BaseEntity } from '../common/entities/base.entity.js';
import { UserRole } from '../common/enums/user.role.enum.js';

@Entity('users')
export class User extends BaseEntity {

  @Index({ unique: true }) 
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Index({ unique: true }) 
  @Column({ type: 'varchar', length: 20, nullable: true }) 
  phone?: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany('Vendor', (vendor: Vendor) => vendor.user)
  vendors!: Relation<Vendor[]>;

  @Column({ type: 'varchar', select: false }) 
  password!: string;

  @Column({ type: 'text', name: 'first_name' }) 
  firstName!: string;

  @Column({ type: 'text',name: 'last_name' }) 
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER }) 
  role!: UserRole;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true }) 
  avatarUrl?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true }) 
  isActive!: boolean;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false }) 
  isEmailVerified!: boolean;

  @Column({ name: 'is_phone_verified', type: 'boolean', default: false }) 
  isPhoneVerified!: boolean;

  @Column({ name: 'refresh_token_hash', type: 'varchar', select: false, nullable: true }) 
  refreshTokenHash?: string;

  @Column({ type: 'varchar', nullable: true }) 
  address?: string;

  @Column({ type: 'varchar', nullable: true }) 
  city?: string;

  @Column({ type: 'varchar', nullable: true }) 
  state?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  longitude?: number;

  get fullName(): 
  string { return `${this.firstName} ${this.lastName}`; 
  }
}
