import { DataSource } from 'typeorm';
import { Product } from '../../products/products.entity.js';
import { Inventory } from '../../inventory/inventory.entity.js';
import { Vendor } from '../../vendors/vendor.entity.js';
import { Category } from '../../categories/category.entity.js';

const SAMPLES = [
  { name: '12.5kg Gas Cylinder Refill',     price: 15000, unit: 'per refill' },
  { name: '5kg Gas Cylinder Refill',         price: 7500,  unit: 'per refill' },
  { name: '20L Dispenser Water',             price: 1200,  unit: 'per bottle' },
  { name: 'Bag of Rice (50kg)',              price: 85000, unit: 'per bag' },
  { name: 'Groundnut Oil (5L)',              price: 9500,  unit: 'per bottle' },
  { name: 'Paracetamol 500mg (blister)',     price: 300,   unit: 'per blister' },
  { name: 'Jollof Rice with Chicken',        price: 2500,  unit: 'per plate' },
  { name: 'Shirt Wash & Iron (per piece)',   price: 500,   unit: 'per piece' },
];

/**
 * ProductFactory — creates Product rows and their matching Inventory records.
 *
 * Usage:
 *   const product = await ProductFactory.create(dataSource, vendor, category);
 *   const list    = await ProductFactory.createMany(dataSource, vendor, category, 5);
 */
export class ProductFactory {
  static async create(
    dataSource: DataSource,
    vendor: Vendor,
    category: Category,
    overrides: Partial<Product> = {},
  ): Promise<Product> {
    const productRepo   = dataSource.getRepository(Product);
    const inventoryRepo = dataSource.getRepository(Inventory);
    const sample  = SAMPLES[Math.floor(Math.random() * SAMPLES.length)]!;
    const index   = Date.now() + Math.floor(Math.random() * 9999);
    const slug    = `${sample.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;

    const product = await productRepo.save(
      productRepo.create({
        vendorId:   vendor.id,
        vendor,
        categoryId: category.id,
        category,
        name:       sample.name,
        slug,
        price:      sample.price,
        unit:       sample.unit,
        isActive:   true,
        ...overrides,
      }),
    );

    await inventoryRepo.save(
      inventoryRepo.create({
        productId:          product.id,
        quantity:           50,
        lowStockThreshold:  5,
        isUnlimited:        false,
        autoDeactivate:     true,
      }),
    );

    return product;
  }

  static createMany(
    dataSource: DataSource,
    vendor: Vendor,
    category: Category,
    count: number,
    overrides: Partial<Product> = {},
  ): Promise<Product[]> {
    return Promise.all(
      Array.from({ length: count }, () =>
        this.create(dataSource, vendor, category, overrides),
      ),
    );
  }
}
