import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  async onModuleInit() {
    return this.$connect;
  }
  onModuleDestroy() {
    return this.$disconnect;
  }
}