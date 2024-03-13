import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FileService } from './file/file.service';

// /FileModule, UserModule, SubscriptionModule
@Module({
  imports: [AuthModule ,CompanyModule , UserModule],
  controllers: [],
})
export class AppModule {}
