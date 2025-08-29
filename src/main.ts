import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import * as fs from 'fs';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const errors: Record<string, string> = {};
        validationErrors.forEach((err) => {
          if (err.constraints) {
            errors[err.property] = Object.values(err.constraints)[0];
          }
        });
        return new BadRequestException(errors);
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(Number(process.env.PORT));
}
bootstrap();
