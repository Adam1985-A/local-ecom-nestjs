import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Cart } from '../cart/cart.entity.js';
import type { Relation } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity.js';
import { BaseEntity } from '../common/entities/base.entity.js';
import { UserRole } from '../common/enums/user.role.enum.js';

@Entity('users')
export class User extends BaseEntity {

  @Index({ unique: true }) 
  @Column()
  email!: string;

  @Index({ unique: true }) 
  @Column({ nullable: true }) 
  phone?: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany('Vendor', (vendor: Vendor) => vendor.user)
  vendors!: Relation<Vendor[]>;

  @Column({ select: false }) 
  password!: string;

  @Column({ name: 'first_name' }) 
  firstName!: string;

  @Column({ name: 'last_name' }) 
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER }) 
  role!: UserRole;

  @Column({ name: 'avatar_url', nullable: true }) 
  avatarUrl?: string;

  @Column({ name: 'is_active', default: true }) 
  isActive!: boolean;

  @Column({ name: 'is_email_verified', default: false }) 
  isEmailVerified!: boolean;

  @Column({ name: 'is_phone_verified', default: false }) 
  isPhoneVerified!: boolean;

  @Column({ name: 'refresh_token_hash', select: false, nullable: true }) 
  refreshTokenHash?: string;

  @Column({ nullable: true }) 
  address?: string;

  @Column({ nullable: true }) 
  city?: string;

  @Column({ nullable: true }) 
  state?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) 
  longitude?: number;

  get fullName(): 
  string { return `${this.firstName} ${this.lastName}`; 
  }
}
