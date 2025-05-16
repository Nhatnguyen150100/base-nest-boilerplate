import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Roles } from '../../decorators/roles.decorators';
import { UserRole } from '../../constants/role';
import { diskStorage } from 'multer';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('images')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload-image')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
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

  @Post('delete-images')
  @Roles(UserRole.ADMIN)
  async removeImage(@Body() body: { urls: string[] }) {
    return this.uploadService.deleteImages(body.urls);
  }
}
