import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { PrismaModule } from '@app/prisma';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports :[PrismaModule],
  providers: [FileService ,CompanyService],
  exports : [FileService],

})
export class FileModule {}
