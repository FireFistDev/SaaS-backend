import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto'
import { CompanyGuard, JwtGuard } from '@app/guard/guard';
import { Request } from 'express';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //   REGISTER COMPANY
  @Post('/register/company')
  registerCompany(@Body() CreateCompanyDto: CreateCompanyDto) {
    return this.authService.registerCompany(CreateCompanyDto)
  }

  //  ACTVATE COMPANY
  @UseGuards(JwtGuard)
  @Get('/activate/company')
  activateCompany(@Req() req: Request) {
    const company = req.user;
    return this.authService.activateCompany(company)
  }
  // LOGIN COMPANY
  @Post("/login/company")
  loginCompany(@Body() LoginDto: LoginDto) {
    return this.authService.loginCompany(LoginDto)
  }

  //  ACTIVATE USER
  @UseGuards(JwtGuard)
  @Get('/activate/user')
  activateUser(@Req() req: Request) {
    const user = req.user;
    const payload = req.body
    console.log(user, payload)
    return this.authService.activateUser(user, payload)
  }

  //  LOGIN USER
  @Post("/login/user")
  loginUser(@Body() LoginDto: LoginDto) {
    return this.authService.loginUser(LoginDto)
  }
}
