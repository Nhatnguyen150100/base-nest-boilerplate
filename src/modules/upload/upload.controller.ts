import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { DEFINE_TAGS_NAME, EHttpMethod } from '@/constants';
import { ApiHttpOperation } from '@/decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.UPLOAD],
    path: '/',
    summary: 'Tải lên 1 file',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_, __, cb) => {
          const dir = path.join(__dirname, '..', '..', '..', 'uploads');
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (_, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.handleFile(file);
  }

  @ApiHttpOperation({
    method: EHttpMethod.DELETE,
    tags: [DEFINE_TAGS_NAME.UPLOAD],
    path: '/',
    summary: 'Xóa nhiều file',
  })
  async removeImage(@Query('urls') urls: string | string[]) {
    const parsedUrls = Array.isArray(urls) ? urls : [urls];
    return this.uploadService.deleteFiles(parsedUrls);
  }
}
