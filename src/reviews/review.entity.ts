import {
  Check, Column, Entity, Index, JoinColumn, ManyToOne, Unique,
} from "typeorm";
import { BaseEntity } from "../common/entities/base.entity.js";
import { User } from "../users/user.entity.js";
import { Order } from "../orders/order.entity.js";
import { Vendor } from "../vendors/vendor.entity.js";
import { Product } from "../products/products.entity.js";

/**
 * One review per customer per order per vendor (or product).
 * The UNIQUE constraint prevents duplicate reviews for the same order.
 */
@Entity("reviews")
@Unique(["customerId", "orderId", "vendorId"])
@Check('"rating" BETWEEN 1 AND 5')
export class Review extends BaseEntity {
  @Index()
  @Column({ name: "customer_id" })
  customerId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  customer!: User;

  @Index()
  @Column({ name: "order_id" })
  orderId!: string;

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Index()
  @Column({ name: "vendor_id" })
  vendorId!: string;

  @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendor_id" })
  vendor!: Vendor;

  @Column({ name: "product_id", nullable: true })
  productId?: string;

  @ManyToOne(() => Product, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "product_id" })
  product?: Product;

  /** Integer 1-5. Validated at DB level by the CHECK constraint above. */
  @Column({ type: "smallint" })
  rating!: number;

  @Column({ type: "text", nullable: true })
  comment?: string;

  /** Admin/vendor can hide inappropriate reviews. */
  @Column({ name: "is_visible", default: true })
  isVisible!: boolean;
}


