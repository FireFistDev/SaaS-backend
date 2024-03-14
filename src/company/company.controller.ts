import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { CompanyGuard } from '@app/guard/guard';
import { Request } from 'express';
import { Company, SubscriptionEnum } from '@prisma/client';
import { FileService } from 'src/file/file.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateCompanyDto } from './dto/update-company.dto';



@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService , private userService : UserService , private authService : AuthService , private fileService : FileService) { }

  //  SELECT SUBSCRIPTION MODEL
  @UseGuards(CompanyGuard)
  @Post('select/subscription/:tier')
  async selectSubscription(@Req() req: Request) {
    const { id } = req.user as Company;
    const { tier } = req.params;
    const TierName: SubscriptionEnum = tier as SubscriptionEnum;
    return await this.companyService.selectSubscription(id, TierName)
  }

  @UseGuards(CompanyGuard)
  @Post('update/company')
  updateCompany(@Req() req: Request) {
    const { id } = req.user as Company;
    const payload = req.body as UpdateCompanyDto;
    return this.companyService.update(id , payload)
  }

  // GET EVERY  USER INSIDE COMPANY
  @UseGuards(CompanyGuard)
  @Get('/getusers')
  getAllUser(@Req() req: Request) {
    const { id } = req.user as Company;
    return this.userService.findAll(+id)
  }

  // CREATE  USER  INSIDE COMPANY
  @UseGuards(CompanyGuard)
  @Post('/createuser')
  registerUser(@Req() req: Request) {
    const { id } = req.user as Company;
    const payload = req.body ;
    const User: CreateUserDto = { ...payload, companyId: id }
    return this.authService.registerUser(User)
  }

  //  DELETE USER 
  @UseGuards(CompanyGuard)
  @Delete('/deleteuser/:userid')
  deleteUser(userid: number) {
    return this.userService.remove(userid)
  }

  //  GET COMPANY FILES
  @UseGuards(CompanyGuard)
  @Get('/getfiles')
  getAllFiles(@Req() req: Request) {
    const { id } = req.user as Company;
    return this.fileService.findAll(id)
  }


}
