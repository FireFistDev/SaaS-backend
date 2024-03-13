import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@app/prisma';
import { FileService } from 'src/file/file.service';
import { jwtStrategy } from '@app/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[PrismaModule],
  controllers: [UserController],
  providers: [UserService, FileService ,jwtStrategy],
  exports : [UserService]
})
export class UserModule {}
