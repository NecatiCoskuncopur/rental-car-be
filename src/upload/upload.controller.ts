import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { UploadResponseDto } from 'src/common/dto/response/upload-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadService } from './upload.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiRoles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: ['vehicle', 'post'] },
      },
      required: ['file', 'type'],
    },
  })
  @ApiOperation({ summary: 'Upload a file for vehicle or post' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'vehicle' | 'post',
  ): Promise<UploadResponseDto> {
    return this.uploadService.uploadFile(file, type);
  }
}
