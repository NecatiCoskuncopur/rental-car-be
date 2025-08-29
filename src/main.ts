import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import * as fs from 'fs';
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

  const config = new DocumentBuilder()
    .setTitle('Rental Car API')
    .setDescription('API documentation for the Rental Car system')
    .setVersion('1.0.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCss: `
    .swagger-ui .opblock .opblock-summary-description {
      background-color:#e74c3c;
      color: white;
      padding: 4px 6px;
      font-weight: semi-bold;
      border-radius: 4px;
      margin-left: 24px;
    }
    `,
  });

  const document = documentFactory();
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  await app.listen(Number(process.env.PORT));
}
bootstrap();
