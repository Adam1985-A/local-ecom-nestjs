import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/user.entity.js';
import { UserRole } from '../../common/enums/user.role.enum.js';

/**
 * UserFactory — generates and persists User rows with realistic data.
 *
 * Usage:
 *   const customer  = await UserFactory.create(dataSource);
 *   const admin     = await UserFactory.create(dataSource, { role: UserRole.ADMIN });
 *   const tenUsers  = await UserFactory.createMany(dataSource, 10);
 */
export class UserFactory {
  static readonly DEFAULT_PASSWORD = 'Password123!';

  static async create(
    dataSource: DataSource,
    overrides: Partial<User> = {},
  ): Promise<User> {
    const repo = dataSource.getRepository(User);
    const index = Date.now() + Math.floor(Math.random() * 9999);
    const hashedPassword = await bcrypt.hash(this.DEFAULT_PASSWORD, 10);

    const user = repo.create({
      email:           `user_${index}@localessentials.test`,
      password:        hashedPassword,
      firstName:       `First${index}`,
      lastName:        `Last${index}`,
      phone:           `+23480${String(index).slice(-8)}`,
      role:            UserRole.CUSTOMER,
      isActive:        true,
      isEmailVerified: true,
      ...overrides,
    });

    return repo.save(user);
  }

  static createMany(
    dataSource: DataSource,
    count: number,
    overrides: Partial<User> = {},
  ): Promise<User[]> {
    return Promise.all(
      Array.from({ length: count }, () => this.create(dataSource, overrides)),
    );
  }

  static createAdmin(dataSource: DataSource): Promise<User> {
    return this.create(dataSource, {
      email:     'admin@localessentials.test',
      firstName: 'Platform',
      lastName:  'Admin',
      role:      UserRole.ADMIN,
    });
  }

  static createSuperAdmin(dataSource: DataSource): Promise<User> {
    return this.create(dataSource, {
      email:     'superadmin@localessentials.test',
      firstName: 'Super',
      lastName:  'Admin',
      role:      UserRole.SUPER_ADMIN,
    });
  }

  static createVendorUser(dataSource: DataSource, index?: number): Promise<User> {
    const i = index ?? Date.now();
    return this.create(dataSource, {
      email:     `vendor_${i}@localessentials.test`,
      firstName: `Vendor${i}`,
      lastName:  'Owner',
      role:      UserRole.VENDOR,
    });
  }

  static createRiderUser(dataSource: DataSource, index?: number): Promise<User> {
    const i = index ?? Date.now();
    return this.create(dataSource, {
      email:     `rider_${i}@localessentials.test`,
      firstName: `Rider${i}`,
      lastName:  'Driver',
      role:      UserRole.RIDER,
    });
  }
}