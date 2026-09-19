import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/entities/base.entity.js";
import { CouponType } from "../common/enums/coupon-type.enum.js";
import { Vendor } from "../vendors/vendor.entity.js";

/**
 * Platform-wide or vendor-scoped discount coupons.
 *
 * - If vendorId is NULL the coupon is platform-wide.
 * - CouponType.FREE_DELIVERY sets the delivery fee to zero.
 * - CouponType.PERCENTAGE uses discountValue as a % (0-100).
 * - CouponType.FIXED_AMOUNT uses discountValue as absolute NGN.
 */
@Entity("coupons")
@Check('"discount_value" > 0')
export class Coupon extends BaseEntity {
  @Index({ unique: true })
  @Column()
  code!: string;

  @Column({ type: "enum", enum: CouponType })
  type!: CouponType;

  @Column({
    name: "discount_value",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  discountValue!: number;

  /** Minimum order subtotal required to use this coupon. */
  @Column({
    name: "minimum_order_amount",
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0,
  })
  minimumOrderAmount!: number;

  /** NULL = unlimited. */
  @Column({ name: "usage_limit", type: "int", nullable: true })
  usageLimit?: number;

  @Column({ name: "usage_count", default: 0 })
  usageCount!: number;

  @Column({ name: "vendor_id", type: 'uuid', nullable: true })
  vendorId?: string;

  @ManyToOne(() => Vendor, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "vendor_id" })
  vendor?: Vendor;

  @Column({ name: "starts_at" })
  startsAt!: Date;

  @Column({ name: "expires_at" })
  expiresAt!: Date;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  get isValid(): boolean {
    const now = new Date();
    const withinLimit =
      this.usageLimit === null || this.usageCount < (this.usageLimit ?? Infinity);
    return this.isActive && withinLimit && now >= this.startsAt && now <= this.expiresAt;
  }
}


