import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '@app/prisma';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyStrategy } from '@app/jwt';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, FileModule],
  providers: [CompanyService, CompanyStrategy],
  controllers: [CompanyController],
  exports: [CompanyService]
})
export class CompanyModule {
}
