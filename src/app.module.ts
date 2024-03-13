import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '@app/prisma';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from '@app/jwt';


@Module({
  imports: [CompanyModule,FileModule, UserModule ],
  // imports: [],
  controllers: [],
})
export class AppModule {}
