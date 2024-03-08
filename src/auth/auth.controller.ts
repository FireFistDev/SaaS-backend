import { Controller,Get,Param,Post, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {


  }

  
  @Post()
  async createCompany(){
    await this.activationEmail('23123')
    return this.authService.createCompany()
  }

  async activationEmail(token){
    console.log(token)
  }

  @Get('/activate/:token')
  // @Redirect('/login') 
  async activateUser(@Param('token') token :string){
    console.log(token)
  }
}
