import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { App, cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): App => {
        const serviceAccount = {
          project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
          client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          private_key: configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        };

        return initializeApp({
          credential: cert(serviceAccount as ServiceAccount),
          storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
      },
    },
    {
      provide: 'FIREBASE_BUCKET',
      inject: ['FIREBASE_APP'],
      useFactory: () => getStorage().bucket(),
    },
  ],
  exports: ['FIREBASE_APP', 'FIREBASE_BUCKET'],
})
export class FirebaseAdminModule {}
