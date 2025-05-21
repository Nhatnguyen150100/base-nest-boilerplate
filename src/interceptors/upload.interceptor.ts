import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

export const UploadFileInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: (_, __, cb) => {
      const dir = path.join(process.cwd(), 'uploads');

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
});
