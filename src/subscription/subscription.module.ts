import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { PrismaModule } from '@app/prisma';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[PrismaModule ,  ScheduleModule.forRoot()],
  providers: [SubscriptionService],
  exports : [SubscriptionService]
})
export class SubscriptionModule {}
