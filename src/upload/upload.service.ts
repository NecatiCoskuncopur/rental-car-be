import { Bucket } from '@google-cloud/storage';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(@Inject('FIREBASE_BUCKET') private bucket: Bucket) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}_${file.originalname}`;
    const firebaseFile = this.bucket.file(fileName);

    const stream = firebaseFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => reject(err));

      stream.on('finish', () => {
        firebaseFile
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${firebaseFile.name}`;
            resolve(publicUrl);
          })
          .catch(reject);
      });

      stream.end(file.buffer);
    });
  }
}
