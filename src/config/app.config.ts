import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  
// Render automatically sets RENDER_EXTERNAL_HOSTNAME on deployed services
  const renderHostname = process.env.RENDER_EXTERNAL_HOSTNAME;
  const defaultUrl = renderHostname
    ? `https://${renderHostname}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  return{
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  name: process.env.APP_NAME || 'Local Essentials',
  url: process.env.APP_URL || 'http://localhost:3000',
  corsOrigins: (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((o) => o.trim()),
};
});
