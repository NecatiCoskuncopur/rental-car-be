import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
