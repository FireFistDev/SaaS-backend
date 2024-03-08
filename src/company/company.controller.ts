import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  
  @Post('/create')
  createCompany(@Body() companydata){
    return  this.companyService.createCompany(companydata)
  }

  @Post('/createuser')
  createUser(@Body('userEmail') userEmail: string,){
    return this.companyService.createUser(userEmail)
  }

}
