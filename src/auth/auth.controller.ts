import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto'
import { CompanyGuard, userGuard } from '@app/guard/guard';
import { Request } from 'express';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Company, User } from '@prisma/client';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //   REGISTER COMPANY
  @Post('/register/company')
  registerCompany(@Body() CreateCompanyDto: CreateCompanyDto) {
    return this.authService.registerCompany(CreateCompanyDto)
  }

  //  ACTVATE COMPANY
  @UseGuards(CompanyGuard)
  @Get('/activate/company')
  activateCompany(@Req() req: Request) {
    const  company = req.user as Company;
    return this.authService.activateCompany(company)
  }

  // LOGIN COMPANY
  @Post("/login/company")
  loginCompany(@Body() LoginDto: LoginDto) {
    return this.authService.loginCompany(LoginDto)
  }

  //  ACTIVATE USER
  @UseGuards(userGuard)
  @Post('/activate/user')
  activateUser(@Req() req: Request) {
    const user = req.user as User;
    const payload = req.body as UpdateUserDto
    return this.authService.activateUser(user, payload)
  }

  //  LOGIN USER
  @Post("/login/user")
  loginUser(@Body() LoginDto: LoginDto) {
    return this.authService.loginUser(LoginDto)
  }
}
