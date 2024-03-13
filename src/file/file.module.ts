import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PrismaModule } from '@app/prisma';

@Module({
  imports :[PrismaModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}