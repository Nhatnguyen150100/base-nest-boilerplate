import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { DEFINE_TAGS_NAME, EHttpMethod } from '@/constants';
import { ApiHttpOperation } from '@/decorators';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileInterceptor } from '@/interceptors';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.UPLOAD],
    path: '/',
    summary: 'Tải lên 1 file',
    body: {
      required: true,
      description: 'Form chứa file tải lên',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Tệp hình ảnh (image, document...)',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(UploadFileInterceptor)
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.handleFile(file);
  }

  @ApiHttpOperation({
    method: EHttpMethod.DELETE,
    tags: [DEFINE_TAGS_NAME.UPLOAD],
    path: '/',
    summary: 'Xóa nhiều file',
    queries: [
      {
        name: 'urls',
        type: String,
        required: true,
        isArray: true,
        description: 'Danh sách URL file cần xóa',
        example: ['https://example.com/a.png', 'https://example.com/b.jpg'],
      },
    ],
  })
  async removeImage(@Query('urls') urls: string | string[]) {
    const parsedUrls = Array.isArray(urls) ? urls : [urls];
    return this.uploadService.deleteFiles(parsedUrls);
  }
}
