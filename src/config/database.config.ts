import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {

const isSSL = process.env.DB_SSL === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
 
  // Render provides DATABASE_URL — use it directly when available
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,               // Never enable in production
      logging: false,
      ssl: { rejectUnauthorized: false }, // Required for Render managed Postgres
    };
  }
 
  const sslConfig = isSSL || isProduction
    ? { rejectUnauthorized: false }
    : false;

return{

  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'local-ecom-nestjs',
  autoLoadEntities: true,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
  ssl: sslConfig,
  extra: sslConfig ? { ssl: sslConfig } : undefined,

//connection pool side settings - important for production
poolSize: parseInt(process.env.DB_POOL_SIZE ?? '10', 10),
connectTimeoutMS: 10_000,

};
});
