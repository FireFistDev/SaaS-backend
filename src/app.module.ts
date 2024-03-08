import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [AuthModule, CompanyModule],
  controllers: [AppController],
})
export class AppModule {}
