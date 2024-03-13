import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '@app/prisma';
import { Company } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/file/file.service';


@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService, private userService: UserService, private jwtService: JwtService , ) { }


  async create(CreateCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.prismaService.company.create({ data: CreateCompanyDto })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to activate company',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async FindOne(email: string): Promise<Company> {
    try {
      return await this.prismaService.company.findUnique({ where: { email } })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to activate company',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async update(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    return await this.prismaService.company.update({
      data: { ...updateCompanyDto },
      where: {
        id: +companyId
      }
    })
  }



  async selectPlan(plan, companyId) {
    try {
      console.log(plan)
      const subscription = await this.prismaService.subscription.upsert({
        where: { companyId },
        create: {
          plan,
          expiresAt: new Date(),
          companyId: companyId
        },
        update: {
          plan,
          expiresAt: new Date()
        },
      });
      console.log(subscription)
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  async CreateUser(CreateUserDto) {
    try {
      const user = await this.userService.create(CreateUserDto)
      const token = this.jwtService.sign(user, { secret: process.env.JWT_SECRET_STRING })
      return `localhost:3000/auth/activate/user?token=${token}`
    } catch (error) {
      throw new HttpException({
        error: 'Failed to Create User',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }
  }

}
