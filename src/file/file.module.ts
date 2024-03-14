import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { PrismaModule } from '@app/prisma';
import { CompanyService } from 'src/company/company.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './Multer.config';

@Module({
  imports :[PrismaModule],
  providers: [FileService ,CompanyService],
  exports : [FileService],
  // controllers: [FileController]
})
export class FileModule {}
