import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? {
        url: databaseUrl,
      }
    : {
  
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'local-ecom-nestjs',

    }),
  entities: [join(_dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(_dirname, 'migration/*{.ts,.js}')],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? 
  { rejectUnauthorized: false } 
  : false,
});
