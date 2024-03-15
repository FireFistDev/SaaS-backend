import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { userStrategy } from '@app/jwt/user.strategy';
import { CompanyService } from 'src/company/company.service';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({defaultStrategy:'jwt',session:true}),
    JwtModule.register({
      secret: process.env.JWT_SECRET_STRING, // Use environment variable for secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  
  controllers: [AuthController],
  providers: [AuthService, userStrategy ,CompanyService, UserService],
  exports : [AuthService]
})
export class AuthModule {}
