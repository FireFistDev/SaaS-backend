import { Controller, Get,  Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  


}
