import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { stat, unlink } from 'fs';
import * as path from 'path';
import { AppConfig, BaseSuccessResponse } from '../../config';
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

  async deleteFiles(imageUrls: string[]) {
    const deletePromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts.pop();
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          fileName,
        );

        stat(filePath, (err) => {
          if (err) {
            return reject({ fileName, message: 'Image not found' });
          }

          unlink(filePath, (err) => {
            if (err) {
              return reject({ fileName, message: 'Could not delete image' });
            }
            resolve({ fileName, message: 'Image deleted successfully' });
          });
        });
      });
    });

    return Promise.allSettled(deletePromises).then((results) => {
      return results.map((result) => {
        if (result.status === 'fulfilled') {
          return new BaseSuccessResponse({
            data: result.value,
            message: 'Image deleted successfully',
          });
        } else {
          throw new InternalServerErrorException(result.reason);
        }
      });
    });
  }
}
