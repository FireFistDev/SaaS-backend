import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '@app/prisma';
import { Company, SubscriptionEnum } from '@prisma/client';
import { SubscriptionPlans } from 'src/subscription/entities/subscription.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';



@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) { }

  //   CREATING COMPANY IN DATABASE
  async create(CreateCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.prismaService.company.create({ data: CreateCompanyDto })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to create company',
        message: error.message.split('\n').reverse()[0],
      }, HttpStatus.BAD_REQUEST);
    }
  }
   
  //  FINDING COMPANY 
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

  //  UPDATING COMPANY BASED ON DTO
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.prismaService.company.update({
        data: { ...updateCompanyDto },
        where: {
          id
        },
      })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to update company',
        message: error.message.split('\n').reverse()[0], // You can customize the error message here
      }, HttpStatus.BAD_REQUEST);
    }

  }

    async selectSubscription(companyId: number, subscriptionEnum) {
      const plan = SubscriptionPlans[subscriptionEnum]
      await this.prismaService.company.update({ where: { id: companyId }, data: { subscription: plan.TierName, subscriptionExpiresAt: new Date() } })
      const company = await this.updateBilling(companyId, -plan.price)
      return company;
    }
    async updateBilling(id: number, billing: number) {
      try {
        return await this.prismaService.company.update({
          data: { billing: { increment: billing } },
          where: {
            id
          },
        })
      } catch (error) {
        throw new HttpException({
          error: 'Failed to update company',
          message: error.message.split('\n').reverse()[0], // You can customize the error message here
        }, HttpStatus.BAD_REQUEST);
      }
    }

  //   async registerUser(createUserDto: CreateUserDto){
  //     const { companyId } = createUserDto;

  //     const company = await this.prismaService.company.findUnique({
  //       where: { id: companyId },
  //       include: { workers: true,}
  //       });

  //     if (!company || !company.subscription) {
  //       throw new HttpException('Company subscription not found', HttpStatus.BAD_REQUEST);
  //     }
  //     const { maxUsers } = SubscriptionPlans[company.subscription];
  //     const currentUserCount = company.workers.length;

  //     if (currentUserCount >= maxUsers) {
  //       throw new HttpException('Maximum user limit reached for the current subscription plan', HttpStatus.BAD_REQUEST);
  //     }
  //     if(company.subscription === 'BasicTier'){
  //       this.updateBilling(companyId , -5)
  //     // }
  //       const user = await this.userService.create(createUserDto)
  //     // const token = this.jwtService.sign(user, { secret: process.env.JWT_SECRET_STRING });

  //     // return `localhost:3000/auth/activate/user?token=${token}`;
  //   }
  // }

}