import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/user.entity.js';
import { UserRole } from '../../common/enums/user.role.enum.js';

const ADMINS = [
  {
    email: 'superadmin@localessentials.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: 'admin@localessentials.com',
    password: 'Admin123!',
    firstName: 'Platform',
    lastName: 'Admin',
    role: UserRole.ADMIN,
  },
];

/**
 * Seeds initial admin and super-admin accounts.
 * Safe to run multiple times — skips existing emails.
 *
 * ⚠️  Change the default passwords immediately after seeding in any
 *      non-development environment.
 */
export async function seedAdminUsers(dataSource: DataSource): Promise<User[]> {
  const repo = dataSource.getRepository(User);
  const created: User[] = [];

  for (const data of ADMINS) {
    const existing = await repo.findOne({ where: { email: data.email } });

    if (existing) {
      console.log(`  ⚠️  ${data.email} already exists — skipping`);
      continue;
    }

    const user = await repo.save(
      repo.create({
        email:           data.email,
        password:        await bcrypt.hash(data.password, 10),
        firstName:       data.firstName,
        lastName:        data.lastName,
        role:            data.role,
        isActive:        true,
        isEmailVerified: true,
      }),
    );

    created.push(user);
    console.log(`  ✅ Created ${data.role}: ${data.email}  password: ${data.password}`);
    console.log(`     ⚠️  Change this password immediately in production!`);
  }

  return created;
}