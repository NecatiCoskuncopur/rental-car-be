import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

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

  const configService = app.get(ConfigService);
  const env = configService.get<string>('NODE_ENV');
  const origin =
    env === 'production'
      ? configService.get<string>('CORS_ORIGINS') || '*'
      : '*';
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(helmet());
  app.use(json({ limit: '2mb' }));
  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(Number(process.env.PORT));
}
bootstrap();
