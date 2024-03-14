import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@app/prisma';
import { FileService } from 'src/file/file.service';
import { jwtStrategy } from '@app/jwt';
import { CompanyService } from 'src/company/company.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { MulterConfigService } from 'src/file/Multer.config';

@Module({
  imports:[PrismaModule , MulterModule.registerAsync({useClass: MulterConfigService })],
  controllers: [UserController],
  providers: [UserService, FileService ,jwtStrategy, CompanyService],
  exports : [UserService]
})
export class UserModule {}
