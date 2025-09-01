import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import mongoose from 'mongoose';

import { AuthModule } from './auth/auth.module';
import { envSchema } from './common/validations/env.validation';
import { HealthController } from './health/health.controller';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: envSchema,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection: mongoose.Connection) => {
          if ((connection.readyState as number) === 1) {
            console.log('DB Connected');
          } else {
            console.warn('DB Connection Failed');
          }
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
