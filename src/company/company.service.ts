import { BadGatewayException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '@app/prisma';
import { Company, SubscriptionEnum } from '@prisma/client';
import { SubscriptionPlans } from 'src/subscription/entities/subscription.entity';
import dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';

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
        message: error.message.split('\n').reverse()[0], 
      }, HttpStatus.BAD_REQUEST);
    }
  }

  //  UPDATING COMPANY BASED ON DTO
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      if( updateCompanyDto.passwordHash){
        updateCompanyDto.passwordHash = await bcrypt.hash(updateCompanyDto.passwordHash, 10)
      }
      return await this.prismaService.company.update({
        data: { ...updateCompanyDto },
        where: {
          id
        },
      })
    } catch (error) {
      throw new HttpException({
        error: 'Failed to update company',
        message: error.message.split('\n').reverse()[0], 
      }, HttpStatus.BAD_REQUEST);
    }

  }
//  SELECT SUBSCRIPTION PLAN
async selectSubscription(companyId: number, subscriptionEnum: SubscriptionEnum) {
  const plan = SubscriptionPlans[subscriptionEnum];
  const currentDate = new Date();
  const expirationDate = new Date(currentDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1); // Adding one month to current date

  try {
    await this.prismaService.company.update({
      where: { id: companyId },
      data: {
        subscription: plan.TierName,
        subscriptionExpiresAt: expirationDate
      }
    });

    const updatedCompany = await this.updateBilling(companyId, -plan.price);
    return updatedCompany;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error selecting subscription:", error);
    throw error;
  }
}


    //  UPDATE COMPANY BILLING
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
          message: error.message.split('\n').reverse()[0], 
        }, HttpStatus.BAD_REQUEST);
      }
    }

}