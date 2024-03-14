import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtStrategy } from '@app/jwt/jwt.strategy';
import { CompanyService } from 'src/company/company.service';
import { CompanyModule } from 'src/company/company.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from '@app/prisma';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({defaultStrategy:'jwt',session:true}),
    JwtModule.register({
      secret: process.env.JWT_SECRET_STRING || "your_secret_key_here" , // Use environment variable for secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy ,CompanyService, UserService],
  exports : [AuthService]
})
export class AuthModule {}
