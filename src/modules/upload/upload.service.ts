import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { stat, unlink } from 'fs';
import * as path from 'path';
import { BaseSuccessResponse } from '../../config/response.config';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class UploadService {
  constructor(private readonly appConfig: AppConfig) {}

  handleFile(file: Express.Multer.File) {
    const imageUrl = `${this.appConfig.appConfig.serverUrl}/${file.filename}`;
    return new BaseSuccessResponse({
      data: imageUrl,
      message: 'Image uploaded successfully',
    });
  }

  async deleteImages(imageUrls: string[]) {
    const deletePromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const imageName = pathParts.pop();
        const imagePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          imageName,
        );

        stat(imagePath, (err) => {
          if (err) {
            return reject({ imageName, message: 'Image not found' });
          }

          unlink(imagePath, (err) => {
            if (err) {
              return reject({ imageName, message: 'Could not delete image' });
            }
            resolve({ imageName, message: 'Image deleted successfully' });
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
