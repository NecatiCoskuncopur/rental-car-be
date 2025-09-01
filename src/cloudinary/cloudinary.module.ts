import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: ConfigOptions = {
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
          api_key: configService.get<string>('CLOUDINARY_API_KEY')!,
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET')!,
        };

        cloudinary.config(options);
        return cloudinary;
      },
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
