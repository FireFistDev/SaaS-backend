import { Controller, Get,  Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionsEnum } from './entities/subscription.entity';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':tier')
  findOne(@Param('tier') tier: SubscriptionsEnum) {
    return this.subscriptionService.findTier(tier);
  }

}
