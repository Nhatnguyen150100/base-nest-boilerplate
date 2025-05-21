import { Injectable } from '@nestjs/common';
import { stat, unlink } from 'fs';
import * as path from 'path';
import { throwInternalError } from '@/helpers';
import { AppConfig, BaseSuccessResponse } from '@/config';
@Injectable()
export class UploadService {
  constructor(private readonly appConfig: AppConfig) {}

  handleFile(file: Express.Multer.File) {
    const fileUrl = `${this.appConfig.generalConfig.serverUrl}/${file.filename}`;
    return new BaseSuccessResponse({
      data: fileUrl,
      message: 'File uploaded successfully',
    });
  }

  async deleteFiles(fileUrls: string[]) {
    const deletePromises = fileUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const encodedFileName = urlObj.pathname.split('/').pop() || '';
        const fileName = decodeURIComponent(encodedFileName);
        const filePath = path.join(process.cwd(), 'uploads', fileName || '');

        stat(filePath, (err) => {
          if (err) {
            return reject({ fileName, message: 'File not found' });
          }

          unlink(filePath, (err) => {
            if (err) {
              return reject({ fileName, message: 'Could not delete file' });
            }
            resolve({ fileName, message: 'File deleted successfully' });
          });
        });
      });
    });

    return Promise.allSettled(deletePromises).then((results) => {
      return results.map((result) => {
        if (result.status === 'fulfilled') {
          return new BaseSuccessResponse({
            data: result.value,
            message: 'File deleted successfully',
          });
        } else {
          throwInternalError(result.reason);
        }
      });
    });
  }
}
