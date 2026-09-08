import { DataSource } from 'typeorm';
import { Vendor } from '../../vendors/vendor.entity.js';
import { User } from '../../users/user.entity.js';
import { BusinessType } from '../../common/enums/business-type.enum.js';
import { VendorStatus } from '../../common/enums/vendor-status.enum.js';

const ALL_BUSINESS_TYPES = Object.values(BusinessType);

const SAMPLE_NAMES: Record<BusinessType, string[]> = {
  [BusinessType.GAS]:        ['QuickGas Supplies', 'CityGas Depot', 'FlameReady Gas'],
  [BusinessType.WATER]:      ['PureFlow Water', 'AquaFresh Delivery', 'ClearDrop Water'],
  [BusinessType.GROCERIES]:  ['FreshMart Store', 'Daily Basket', 'QuickMart Groceries'],
  [BusinessType.MEDICINES]:  ['MediExpress Pharmacy', 'CarePoint Drugs', 'HealthPlus Pharmacy'],
  [BusinessType.FOOD]:       ['TasteHub Kitchen', 'SpiceRoute Restaurant', 'QuickBite Meals'],
  [BusinessType.LAUNDRY]:    ['CleanWave Laundry', 'FreshFold Services', 'SparkClean Laundry'],
};

/**
 * VendorFactory — creates Vendor profiles linked to existing User accounts.
 *
 * Usage:
 *   const vendor = await VendorFactory.create(dataSource, vendorUser);
 */
export class VendorFactory {
  static async create(
    dataSource: DataSource,
    user: User,
    overrides: Partial<Vendor> = {},
  ): Promise<Vendor> {
    const repo = dataSource.getRepository(Vendor);
    const businessType = overrides.businessType
      ?? ALL_BUSINESS_TYPES[Math.floor(Math.random() * ALL_BUSINESS_TYPES.length)]!;
    const names   = SAMPLE_NAMES[businessType];
    const name    = names[Math.floor(Math.random() * names.length)];
    const index   = Math.floor(Math.random() * 9999);

    const vendor = repo.create({
      userId:               user.id,
      user,
      businessName:         `${name} ${index}`,
      businessType,
      phone:                `+234802${String(index).padStart(7, '0')}`,
      address:              `${index} Test Street`,
      city:                 'Lagos',
      state:                'Lagos',
      status:               VendorStatus.APPROVED,
      isOpen:               true,
      commissionRate:       10,
      minimumOrderAmount:   500,
      ...overrides,
    });

    return repo.save(vendor);
  }
}