import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from '@app/prisma';

@Module({
  imports:[PrismaModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports : [SubscriptionService]
})
export class SubscriptionModule {}
