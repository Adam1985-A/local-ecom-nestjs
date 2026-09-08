import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface SalesSummary {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface TopVendor {
  vendorId: string;
  businessName: string;
  totalOrders: string;
  totalRevenue: string;
}

export interface TopProduct {
  productId: string;
  name: string;
  totalSold: string;
  totalRevenue: string;
}

export interface DailyRevenue {
  date: string;
  revenue: string;
  orders: string;
}

@Injectable()
export class AnalyticsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getSalesSummary(from: Date, to: Date, vendorId?: string): Promise<SalesSummary> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'totalOrders')
      .addSelect("COUNT(*) FILTER (WHERE o.status = 'delivered')", 'deliveredOrders')
      .addSelect("COUNT(*) FILTER (WHERE o.status = 'cancelled')", 'cancelledOrders')
      .addSelect("COALESCE(SUM(o.total) FILTER (WHERE o.payment_status = 'paid'), 0)", 'totalRevenue')
      .addSelect("COALESCE(SUM(o.commission_amount) FILTER (WHERE o.payment_status = 'paid'), 0)", 'totalCommission')
      .from('orders', 'o')
      .where('o.created_at BETWEEN :from AND :to', { from, to })
      .andWhere('o.deleted_at IS NULL');

    if (vendorId) qb.andWhere('o.vendor_id = :vendorId', { vendorId });

    const raw = await qb.getRawOne<Record<string, string>>();

    return {
      totalOrders: parseInt(raw?.totalOrders ?? '0', 10),
      deliveredOrders: parseInt(raw?.deliveredOrders ?? '0', 10),
      cancelledOrders: parseInt(raw?.cancelledOrders ?? '0', 10),
      totalRevenue: parseFloat(raw?.totalRevenue ?? '0'),
      totalCommission: parseFloat(raw?.totalCommission ?? '0'),
    };
  }

  async getTopVendors(
    from: Date, 
    to: Date, 
    limit = 10
  ): Promise<TopVendor[]> {

    return this.dataSource
    
      .createQueryBuilder()
      .select('o.vendor_id', 'vendorId')
      .addSelect('v.business_name', 'businessName')
      .addSelect('COUNT(o.id)', 'totalOrders')
      .addSelect(
      "COALESCE(SUM(o.total) FILTER (WHERE o.payment_status = 'paid'), 0)", 
      'totalRevenue'
      )
      .from('orders', 'o')
      .innerJoin('vendors', 'v', 'v.id = o.vendor_id')
      .where('o.created_at BETWEEN :from AND :to', { from, to })
      .andWhere('o.deleted_at IS NULL')
      .andWhere('v.deleted_at IS NULL')
      .groupBy('o.vendor_id, v.business_name')
      .orderBy('"totalRevenue"', 'DESC')
      .limit(limit)
      .getRawMany<TopVendor>();

      
  }

  async getTopProducts(from: Date, to: Date, vendorId?: string, limit = 10): Promise<TopProduct[]> {
  const qb = this.dataSource
      .createQueryBuilder()
      .select('oi.product_id', 'productId')
      .addSelect('oi.product_name', 'name')
      .addSelect('SUM(oi.quantity)', 'totalSold')
      .addSelect('SUM(oi.subtotal)', 'totalRevenue')
      .from('order_items', 'oi')
      .innerJoin('orders', 'o', 'o.id = oi.order_id')
      .where('o.created_at BETWEEN :from AND :to', { from, to })
      .andWhere("o.payment_status = 'paid'")
      .andWhere('o.deleted_at IS NULL')
      .andWhere('oi.deleted_at IS NULL');

    if (vendorId) qb.andWhere('o.vendor_id = :vendorId', { vendorId });

    return qb
      .groupBy('oi.product_id, oi.product_name')
      .orderBy('"totalSold"', 'DESC')
      .limit(limit)
      .getRawMany<TopProduct>();
  }

  async getDailyRevenue(from: Date, to: Date, vendorId?: string): Promise<DailyRevenue[]> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select("TO_CHAR(o.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect("COALESCE(SUM(o.total) FILTER (WHERE o.payment_status = 'paid'), 0)", 'revenue')
      .addSelect('COUNT(o.id)', 'orders')
      .from('orders', 'o')
      .where('o.created_at BETWEEN :from AND :to', { from, to })
      .andWhere('o.deleted_at IS NULL');

    if (vendorId) qb.andWhere('o.vendor_id = :vendorId', { vendorId });

    return qb
      .groupBy("TO_CHAR(o.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany<DailyRevenue>();
  }

  async getVendorDashboard(vendorId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [summary, topProducts, dailyRevenue] = await Promise.all([
      this.getSalesSummary(thirtyDaysAgo, now, vendorId),
      this.getTopProducts(thirtyDaysAgo, now, vendorId, 5),
      this.getDailyRevenue(thirtyDaysAgo, now, vendorId),
    ]);
    return { summary, topProducts, dailyRevenue };
  }

  async getPlatformDashboard() {
    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [summary7d, summary30d, topVendors, topProducts, dailyRevenue] = await Promise.all([
      this.getSalesSummary(sevenDaysAgo, now),
      this.getSalesSummary(thirtyDaysAgo, now),
      this.getTopVendors(thirtyDaysAgo, now, 10),
      this.getTopProducts(thirtyDaysAgo, now, undefined, 10),
      this.getDailyRevenue(thirtyDaysAgo, now),
    ]);
    return { summary7d, summary30d, topVendors, topProducts, dailyRevenue };
  }
}
