import { Body, Controller,Get,Param,Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto} from './dto/auth.dto'
import { CompanyGuard, JwtGuard } from '@app/guard/guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/register/company')
  registerCompany(@Body() CreateCompanyDto){
    return this.authService.registerCompany(CreateCompanyDto)
  }
  

  @UseGuards(JwtGuard)
  @Get('/activate/company')
  activateCompany(@Req() req : Request){
    const company = req.user;
    return this.authService.activateCompany(company)
  }

  @Post("/login/company")
  loginCompany(@Body() LoginDto: LoginDto){
    return this.authService.loginCompany(LoginDto)
  }


  @UseGuards(JwtGuard)
  @Get('/activate/user')
  activateUser(@Req() req : Request){
    const user = req.user;
    const payload = req.body
    console.log(user, payload)
    return this.authService.activateUser(user,payload)
  }


  @Post("/login/user")
  loginUser(@Body() LoginDto: LoginDto){
    return this.authService.loginUser(LoginDto)
  }
}
