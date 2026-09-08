import 'reflect-metadata';
import { AppDataSource } from '../data-source.js';
import { seedAdminUsers } from './admin.seeder.js';

async function run() {
  try {
    await AppDataSource.initialize();

    console.log('Database connected.');
    console.log('Seeding admin users...');

    await seedAdminUsers(AppDataSource);

    console.log('Admin seeding completed.');
  } catch (error) {
    console.error('Admin seeding failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();