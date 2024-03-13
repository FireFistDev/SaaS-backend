import { BadGatewayException, Injectable } from '@nestjs/common';
import { SubscriptionsEnum, SubscriptionTier, SubscriptionPlans } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  findAll(): Record<SubscriptionsEnum, SubscriptionTier> {
    return SubscriptionPlans;
  }

  async findTier(subscriptionEnum: SubscriptionsEnum): Promise<SubscriptionTier | null> {
    try {
      if(!SubscriptionPlans[subscriptionEnum]){
      
       throw new BadGatewayException('no subscription plan')
      }
      return SubscriptionPlans[subscriptionEnum] ;
    } catch (error) {
      return error.message;
    }
  }


}
