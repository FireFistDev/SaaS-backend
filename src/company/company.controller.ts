import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionsEnum } from 'src/subscription/entities/subscription.entity';
import { CompanyGuard } from '@app/guard/guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Company } from '@prisma/client';
import { FileService } from 'src/file/file.service';



@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService, private userService : UserService , private fileService : FileService) {}
  

  @UseGuards(CompanyGuard) 
  @Get('/getusers')
  getAllUser(@Req() req : Request){
    const {id}  = req.user as Company;
    return this.userService.findAll(+id)
  }

  @UseGuards(CompanyGuard) 
  @Post('/createuser')
  createUser(@Req() req : Request){
    const {id}  = req.user as Company;
    const payload = req.body;
    const User = {...payload,companyId : id} as CreateCompanyDto
    console.log(User)
    return this.companyService.CreateUser(User)
  }


  @Delete('/deleteuser')
  deleteUser(id :number){
    return this.userService.remove(id)
  }
  @UseGuards(CompanyGuard) 
  @Post('select/subscription/:tier')
  selectSubscription(@Req() req : Request) {
    const {id}  = req.user as Company;
    const payload = req.params;
    const plan =this.companyService.selectPlan(payload.tier, id);
  }
  // @UseGuards(CompanyGuard) 
  @Get('/getfiles')
  getAllFiles(@Req() req : Request){
    // const {id}  = req.user as Company;
    return this.fileService.findAll(3)
  }


}
  