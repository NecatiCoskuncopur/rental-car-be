import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiRoles('admin')
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.uploadImage(file);
    return { imageUrl };
  }
}
