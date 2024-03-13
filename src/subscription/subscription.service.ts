import { BadGatewayException, Injectable } from '@nestjs/common';
import { SubscriptionTier, SubscriptionPlans } from './entities/subscription.entity';
import { SubscriptionEnum } from '@prisma/client';
import { create } from 'domain';
import { PrismaService } from '@app/prisma';
@Injectable()
export class SubscriptionService {
  constructor(private prismaService : PrismaService){}
  findAll(): Record<SubscriptionEnum, SubscriptionTier> {
    return SubscriptionPlans;
  }

  async findTier(subscriptionEnum: SubscriptionEnum): Promise<SubscriptionTier | null> {
    try {
      if(!SubscriptionPlans[subscriptionEnum]){
        throw new BadGatewayException('no subscription plan')

      }
      return SubscriptionPlans[subscriptionEnum] ;
    } catch (error) {
      return error.message;
    }
  }

  async selectSubscription(id :number , subscriptionEnum: SubscriptionEnum) { 
    try {
      const plan = SubscriptionPlans[subscriptionEnum] 
      console.log(plan)
      const company =  this.prismaService.company.update({where: {id}, data : { subscription: plan.TierName,subscriptionExpiresAt : new Date()}})
    } catch (error) {
      return error.message;
    }
  }

}
