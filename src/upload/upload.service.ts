import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { v2 as Cloudinary } from 'cloudinary';

import { UploadResponseDto } from 'src/common/dto/response/upload-response.dto';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadFile(
    file: Express.Multer.File,
    type: 'vehicle' | 'post',
  ): Promise<UploadResponseDto> {
    if (!file || !file.buffer) {
      throw new Error('File is missing or invalid');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: type,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          const dto = plainToInstance(UploadResponseDto, result, {
            excludeExtraneousValues: true,
          });
          resolve(dto);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
