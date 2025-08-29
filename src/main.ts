import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(helmet());

  app.use(cookieParser());
  app.use(json({ limit: '2mb' }));

  const configService = app.get(ConfigService);
  const env = configService.get<string>('NODE_ENV');
  const origin =
    env === 'production'
      ? configService.get<string>('CORS_ORIGINS_PROD')
      : configService.get<string>('CORS_ORIGINS_DEV');

  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(Number(process.env.PORT));
}
bootstrap();
