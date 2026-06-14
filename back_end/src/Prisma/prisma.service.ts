
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import 'dotenv/config'


import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../../prisma/client/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  constructor(){
    const connectionString = `${process.env.DATABASE_URL}`;
    //console.log(process.env.DATABASE_URL)
    const adapter = new PrismaPg({connectionString})
   // const prisma = new PrismaClient({adapter});
    super({adapter})
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}