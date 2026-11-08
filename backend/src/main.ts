import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter((origin): origin is string => Boolean(origin));

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET'],
  });

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');
}

void bootstrap();