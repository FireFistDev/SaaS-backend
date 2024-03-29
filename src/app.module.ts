import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FileService } from './file/file.service';
import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,AuthModule,CompanyModule, SubscriptionModule],
  // imports : [ SubscriptionModule],
  controllers: [],
})
export class AppModule { }
