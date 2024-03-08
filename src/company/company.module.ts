import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [UserModule,SubscriptionModule],
})
export class CompanyModule {}
