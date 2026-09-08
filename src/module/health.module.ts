import { Controller, Get, Module } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../common/decorator/public.decorator.js';

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Render uses this endpoint to know the service is alive.
   * It checks the database connection so Render also knows the DB is reachable.
   *
   * GET /api/v1/health
   */
  @Public()
  @Get()
  async check() {
    let dbStatus = 'ok';
    let dbMessage = 'connected';

    try {
      await this.dataSource.query('SELECT 1');
    } catch (err) {
      dbStatus = 'error';
      dbMessage = (err as Error).message;
    }

    const isHealthy = dbStatus === 'ok';

    return {
      status:    isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime:    Math.floor(process.uptime()),
      environment: process.env.NODE_ENV ?? 'development',
      services: {
        database: { status: dbStatus, message: dbMessage },
        api:      { status: 'ok' },
      },
    };
  }
}

@Module({
  controllers: [HealthController],
})
export class HealthModule {}