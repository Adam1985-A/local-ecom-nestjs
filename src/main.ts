import "reflect-metadata";
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './module/app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptor/response.interceptor.js';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  
  const corsOrigins = configService.get<string[]>('app.corsOrigins') ?? ['*'];

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });

  // NOTE: apiPrefix already contains the version segment (e.g. "api/v1").
  // Do NOT also call enableVersioning() – combining both doubles the segment.
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), 
  new ResponseInterceptor());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), 
  new RolesGuard(reflector));


  if (process.env.NODE_ENV !== 'production') {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Local Essentials API')
    .setDescription(
      'API for the Local Essentials Delivery Platform – Gas, Water, Groceries, Medicines, Food, Laundry',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }


  const port = parseInt(process.env.PORT ?? '3000', 10);

  await app.listen(port, '0.0.0.0');
  const appUrl = 
       process.env.NODE_ENV === 'production'
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME ?? 'your-app.onrender.com'}`
    : `http://localhost:${port}`;
  console.log(`🚀 API running on: ${appUrl}/${apiPrefix}`);
  console.log(`📚 Health check: ${appUrl}/${apiPrefix}/health`);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`📖 Swagger docs: ${appUrl}/${apiPrefix}/docs`);
  }
}

bootstrap();