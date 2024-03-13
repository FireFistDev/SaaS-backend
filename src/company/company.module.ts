import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '@app/prisma';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CompanyStrategy } from '@app/jwt';
import { FileService } from 'src/file/file.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { AuthService } from 'src/auth/auth.service';


@Module({
  imports: [PrismaModule],
  providers: [CompanyService, UserService, CompanyStrategy , FileService ,JwtService],
  controllers: [CompanyController],
  exports: [CompanyService]
})
export class CompanyModule {
}
