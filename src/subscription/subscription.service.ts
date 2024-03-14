import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  async chargeSubscriptions() {
    const currentDay = new Date();
    const tomorrow = new Date(currentDay);
    tomorrow.setDate(currentDay.getDate() + 1);
    const companies = await this.prismaService.company.findMany({
      where: {
        subscriptionExpiresAt: {
          gte: currentDay,
          lte: tomorrow,
        },
      },
    });
    for(let subscription of companies) {
      console.log(subscription , ' lets charge there')
    }
  }
}
