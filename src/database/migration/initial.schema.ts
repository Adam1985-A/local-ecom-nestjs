import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial migration — creates every table required by the Local Essentials platform.
 *
 * Run:   npm run migration:run
 * Undo:  npm run migration:revert
 */
export class InitialSchema1718000000000 implements MigrationInterface {
  name = 'InitialSchema1718000000000';

  // ─────────────────────────────────────────────────────────────────────────
  // UP
  // ─────────────────────────────────────────────────────────────────────────
  public async up(queryRunner: QueryRunner): Promise<void> {

    /* ── Postgres extension ──────────────────────────────────────────────── */
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    /* ── Enums ───────────────────────────────────────────────────────────── */
    await queryRunner.query(`CREATE TYPE "user_role_enum"                   AS ENUM ('customer','vendor','rider','admin','super_admin')`);
    await queryRunner.query(`CREATE TYPE "business_type_enum"               AS ENUM ('gas','water','groceries','medicines','food','laundry')`);
    await queryRunner.query(`CREATE TYPE "vendor_status_enum"               AS ENUM ('pending','approved','suspended','rejected')`);
    await queryRunner.query(`CREATE TYPE "order_status_enum"                AS ENUM ('pending','confirmed','preparing','ready_for_pickup','out_for_delivery','delivered','cancelled','refunded')`);
    await queryRunner.query(`CREATE TYPE "payment_status_enum"              AS ENUM ('pending','paid','failed','refunded')`);
    await queryRunner.query(`CREATE TYPE "payment_method_enum"              AS ENUM ('card','bank_transfer','wallet','cash_on_delivery')`);
    await queryRunner.query(`CREATE TYPE "delivery_status_enum"             AS ENUM ('pending','assigned','picked_up','en_route','delivered','failed')`);
    await queryRunner.query(`CREATE TYPE "rider_status_enum"                AS ENUM ('offline','available','on_delivery','suspended')`);
    await queryRunner.query(`CREATE TYPE "wallet_transaction_type_enum"     AS ENUM ('credit','debit')`);
    await queryRunner.query(`CREATE TYPE "wallet_transaction_source_enum"   AS ENUM ('order_payment','order_refund','wallet_funding','withdrawal','promotion','rider_earning','vendor_payout','adjustment')`);
    await queryRunner.query(`CREATE TYPE "coupon_type_enum"                 AS ENUM ('percentage','fixed_amount','free_delivery')`);
    await queryRunner.query(`CREATE TYPE "notification_type_enum"           AS ENUM ('order_update','payment','promotion','delivery','system','wallet')`);
    await queryRunner.query(`CREATE TYPE "notification_channel_enum"        AS ENUM ('email','sms','push','in_app')`);

    /* ── users ───────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"               VARCHAR      NOT NULL,
        "phone"               VARCHAR,
        "password"            VARCHAR      NOT NULL,
        "first_name"          VARCHAR      NOT NULL,
        "last_name"           VARCHAR      NOT NULL,
        "role"                "user_role_enum" NOT NULL DEFAULT 'customer',
        "avatar_url"          VARCHAR,
        "is_active"           BOOLEAN      NOT NULL DEFAULT true,
        "is_email_verified"   BOOLEAN      NOT NULL DEFAULT false,
        "is_phone_verified"   BOOLEAN      NOT NULL DEFAULT false,
        "refresh_token_hash"  VARCHAR,
        "address"             VARCHAR,
        "city"                VARCHAR,
        "state"               VARCHAR,
        "latitude"            DECIMAL(10,7),
        "longitude"           DECIMAL(10,7),
        "created_at"          TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at"          TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "deleted_at"          TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users"("email") WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_phone" ON "users"("phone") WHERE deleted_at IS NULL AND phone IS NOT NULL`);

    /* ── vendors ─────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "vendors" (
        "id"                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"               UUID         NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "business_name"         VARCHAR      NOT NULL,
        "business_type"         "business_type_enum" NOT NULL,
        "description"           TEXT,
        "logo_url"              VARCHAR,
        "cover_image_url"       VARCHAR,
        "phone"                 VARCHAR      NOT NULL,
        "address"               VARCHAR      NOT NULL,
        "city"                  VARCHAR      NOT NULL,
        "state"                 VARCHAR      NOT NULL,
        "latitude"              DECIMAL(10,7),
        "longitude"             DECIMAL(10,7),
        "status"                "vendor_status_enum" NOT NULL DEFAULT 'pending',
        "rejection_reason"      VARCHAR,
        "is_open"               BOOLEAN      NOT NULL DEFAULT true,
        "opening_time"          TIME,
        "closing_time"          TIME,
        "minimum_order_amount"  DECIMAL(12,2) NOT NULL DEFAULT 0,
        "commission_rate"       DECIMAL(5,2)  NOT NULL DEFAULT 10,
        "average_rating"        DECIMAL(3,2)  NOT NULL DEFAULT 0,
        "total_reviews"         INTEGER       NOT NULL DEFAULT 0,
        "created_at"            TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"            TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"            TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_vendors_user_id"      ON "vendors"("user_id") WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE        INDEX "IDX_vendors_business_type" ON "vendors"("business_type")`);
    await queryRunner.query(`CREATE        INDEX "IDX_vendors_status"       ON "vendors"("status")`);

    /* ── categories ──────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"          VARCHAR     NOT NULL,
        "slug"          VARCHAR     NOT NULL,
        "description"   TEXT,
        "icon_url"      VARCHAR,
        "business_type" "business_type_enum" NOT NULL,
        "parent_id"     UUID        REFERENCES "categories"("id") ON DELETE SET NULL,
        "sort_order"    INTEGER     NOT NULL DEFAULT 0,
        "is_active"     BOOLEAN     NOT NULL DEFAULT true,
        "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_categories_slug" ON "categories"("slug") WHERE deleted_at IS NULL`);

    /* ── products ────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id"               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "vendor_id"        UUID         NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
        "category_id"      UUID         NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT,
        "name"             VARCHAR      NOT NULL,
        "slug"             VARCHAR      NOT NULL,
        "description"      TEXT,
        "price"            DECIMAL(12,2) NOT NULL,
        "discounted_price" DECIMAL(12,2),
        "image_url"        VARCHAR,
        "image_public_id"  VARCHAR,
        "unit"             VARCHAR,
        "is_active"        BOOLEAN       NOT NULL DEFAULT true,
        "average_rating"   DECIMAL(3,2)  NOT NULL DEFAULT 0,
        "total_reviews"    INTEGER       NOT NULL DEFAULT 0,
        "created_at"       TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"       TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_products_slug"       ON "products"("slug") WHERE deleted_at IS NULL`);
    await queryRunner.query(`CREATE        INDEX "IDX_products_vendor_id" ON "products"("vendor_id")`);

    /* ── inventory ───────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "inventory" (
        "id"                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id"          UUID        NOT NULL UNIQUE REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity"            INTEGER     NOT NULL DEFAULT 0,
        "low_stock_threshold" INTEGER     NOT NULL DEFAULT 5,
        "is_unlimited"        BOOLEAN     NOT NULL DEFAULT false,
        "auto_deactivate"     BOOLEAN     NOT NULL DEFAULT true,
        "created_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at"          TIMESTAMPTZ
      )
    `);

    /* ── carts ───────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "carts" (
        "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"    UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "vendor_id"  UUID        NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "UQ_carts_user_vendor" UNIQUE ("user_id","vendor_id")
      )
    `);

    /* ── cart_items ──────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id"         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "cart_id"    UUID         NOT NULL REFERENCES "carts"("id") ON DELETE CASCADE,
        "product_id" UUID         NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity"   INTEGER      NOT NULL,
        "unit_price" DECIMAL(12,2) NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ
      )
    `);

    /* ── orders ──────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id"                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "reference"           VARCHAR      NOT NULL UNIQUE,
        "customer_id"         UUID         NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
        "vendor_id"           UUID         NOT NULL REFERENCES "vendors"("id") ON DELETE RESTRICT,
        "status"              "order_status_enum" NOT NULL DEFAULT 'pending',
        "subtotal"            DECIMAL(12,2) NOT NULL,
        "delivery_fee"        DECIMAL(12,2) NOT NULL DEFAULT 0,
        "discount_amount"     DECIMAL(12,2) NOT NULL DEFAULT 0,
        "total"               DECIMAL(12,2) NOT NULL,
        "payment_method"      "payment_method_enum" NOT NULL DEFAULT 'card',
        "payment_status"      "payment_status_enum" NOT NULL DEFAULT 'pending',
        "coupon_code"         VARCHAR,
        "delivery_address"    VARCHAR       NOT NULL,
        "delivery_city"       VARCHAR       NOT NULL,
        "delivery_state"      VARCHAR       NOT NULL,
        "delivery_latitude"   DECIMAL(10,7),
        "delivery_longitude"  DECIMAL(10,7),
        "customer_note"       TEXT,
        "vendor_note"         TEXT,
        "cancelled_reason"    VARCHAR,
        "commission_amount"   DECIMAL(12,2) NOT NULL DEFAULT 0,
        "created_at"          TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"          TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"          TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_orders_customer_id" ON "orders"("customer_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_vendor_id"   ON "orders"("vendor_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_status"      ON "orders"("status")`);

    /* ── order_items ─────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id"           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "order_id"     UUID         NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id"   UUID         REFERENCES "products"("id") ON DELETE SET NULL,
        "product_name" VARCHAR      NOT NULL,
        "unit_price"   DECIMAL(12,2) NOT NULL,
        "quantity"     INTEGER       NOT NULL,
        "subtotal"     DECIMAL(12,2) NOT NULL,
        "created_at"   TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"   TIMESTAMPTZ
      )
    `);

    /* ── wallets ─────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id"             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"        UUID         NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "balance"        DECIMAL(15,2) NOT NULL DEFAULT 0,
        "locked_balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
        "is_active"      BOOLEAN       NOT NULL DEFAULT true,
        "created_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMPTZ
      )
    `);

    /* ── wallet_transactions ─────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "wallet_transactions" (
        "id"             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "wallet_id"      UUID         NOT NULL REFERENCES "wallets"("id") ON DELETE CASCADE,
        "reference"      VARCHAR      NOT NULL UNIQUE,
        "type"           "wallet_transaction_type_enum"   NOT NULL,
        "source"         "wallet_transaction_source_enum" NOT NULL,
        "amount"         DECIMAL(15,2) NOT NULL,
        "balance_before" DECIMAL(15,2) NOT NULL,
        "balance_after"  DECIMAL(15,2) NOT NULL,
        "description"    TEXT,
        "related_id"     VARCHAR,
        "created_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_wallet_transactions_wallet_id" ON "wallet_transactions"("wallet_id")`);

    /* ── payments ────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id"                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "reference"         VARCHAR      NOT NULL UNIQUE,
        "gateway_reference" VARCHAR,
        "order_id"          UUID         NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "user_id"           UUID         NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
        "amount"            DECIMAL(12,2) NOT NULL,
        "method"            "payment_method_enum"  NOT NULL,
        "status"            "payment_status_enum"  NOT NULL DEFAULT 'pending',
        "gateway_response"  JSONB,
        "paid_at"           TIMESTAMPTZ,
        "created_at"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"        TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_payments_order_id" ON "payments"("order_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_payments_user_id"  ON "payments"("user_id")`);

    /* ── riders ──────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "riders" (
        "id"                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"           UUID        NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "vehicle_type"      VARCHAR     NOT NULL,
        "vehicle_plate"     VARCHAR,
        "status"            "rider_status_enum" NOT NULL DEFAULT 'offline',
        "current_latitude"  DECIMAL(10,7),
        "current_longitude" DECIMAL(10,7),
        "is_verified"       BOOLEAN     NOT NULL DEFAULT false,
        "total_deliveries"  INTEGER     NOT NULL DEFAULT 0,
        "average_rating"    DECIMAL(3,2) NOT NULL DEFAULT 0,
        "nin"               VARCHAR,
        "guarantor_name"    VARCHAR,
        "guarantor_phone"   VARCHAR,
        "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at"        TIMESTAMPTZ
      )
    `);

    /* ── deliveries ──────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "deliveries" (
        "id"             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "order_id"       UUID         NOT NULL UNIQUE REFERENCES "orders"("id") ON DELETE CASCADE,
        "rider_id"       UUID         REFERENCES "riders"("id") ON DELETE SET NULL,
        "status"         "delivery_status_enum" NOT NULL DEFAULT 'pending',
        "assigned_at"    TIMESTAMPTZ,
        "picked_up_at"   TIMESTAMPTZ,
        "delivered_at"   TIMESTAMPTZ,
        "delivery_fee"   DECIMAL(12,2) NOT NULL DEFAULT 0,
        "rider_earnings" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "rider_note"     TEXT,
        "handover_otp"   VARCHAR,
        "created_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"     TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_deliveries_rider_id" ON "deliveries"("rider_id")`);

    /* ── reviews ─────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id"          UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" UUID       NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "order_id"    UUID       NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "vendor_id"   UUID       NOT NULL REFERENCES "vendors"("id") ON DELETE CASCADE,
        "product_id"  UUID       REFERENCES "products"("id") ON DELETE SET NULL,
        "rating"      SMALLINT   NOT NULL CHECK (rating BETWEEN 1 AND 5),
        "comment"     TEXT,
        "is_visible"  BOOLEAN    NOT NULL DEFAULT true,
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMPTZ,
        CONSTRAINT "UQ_reviews_customer_order_vendor" UNIQUE ("customer_id","order_id","vendor_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_vendor_id"   ON "reviews"("vendor_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_customer_id" ON "reviews"("customer_id")`);

    /* ── notifications ───────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id"    UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type"       "notification_type_enum"    NOT NULL,
        "channel"    "notification_channel_enum" NOT NULL,
        "title"      VARCHAR     NOT NULL,
        "body"       TEXT        NOT NULL,
        "metadata"   JSONB,
        "is_read"    BOOLEAN     NOT NULL DEFAULT false,
        "sent_at"    TIMESTAMPTZ,
        "related_id" VARCHAR,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_notifications_user_id" ON "notifications"("user_id")`);

    /* ── coupons ─────────────────────────────────────────────────────────── */
    await queryRunner.query(`
      CREATE TABLE "coupons" (
        "id"                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        "code"                 VARCHAR      NOT NULL UNIQUE,
        "type"                 "coupon_type_enum" NOT NULL,
        "discount_value"       DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
        "minimum_order_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
        "usage_limit"          INTEGER,
        "usage_count"          INTEGER       NOT NULL DEFAULT 0,
        "vendor_id"            UUID          REFERENCES "vendors"("id") ON DELETE SET NULL,
        "starts_at"            TIMESTAMPTZ   NOT NULL,
        "expires_at"           TIMESTAMPTZ   NOT NULL,
        "is_active"            BOOLEAN       NOT NULL DEFAULT true,
        "created_at"           TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"           TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"           TIMESTAMPTZ
      )
    `);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DOWN — drop in reverse dependency order
  // ─────────────────────────────────────────────────────────────────────────
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "coupons"              CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"        CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "reviews"              CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "deliveries"           CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "riders"               CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"             CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallet_transactions"  CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallets"              CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items"          CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"               CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cart_items"           CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "carts"                CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"            CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"             CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"           CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendors"              CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"                CASCADE`);

    await queryRunner.query(`DROP TYPE IF EXISTS "notification_channel_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notification_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "coupon_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "wallet_transaction_source_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "wallet_transaction_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "rider_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "delivery_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "vendor_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "business_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}