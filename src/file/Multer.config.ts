import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import * as path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: 'uploads/files',
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['.csv', '.xls', '.xlsx' , '.pdf'];

        // Check file extension
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(fileExt)) {
          return cb(null, true); // Accept the file
        } else {
          cb(new Error('Only CSV, XLS, and XLSX files are allowed!'), false); // Reject the file
        }
      },
    };
  }
}