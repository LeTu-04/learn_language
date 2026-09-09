import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VocabImportController } from './vocab-import.controller.js';
import { VocabImportProcessor } from './vocab-import.processor.js';
import { PrismaModule } from '../../Prisma/prisma.module.js';
import { TicketModule } from '../notifications/ticket.module.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'excel-import-queue',
    }),
    PrismaModule,
    TicketModule,
  ],
  controllers: [VocabImportController],
  providers: [VocabImportProcessor],
})
export class VocabImportModule {}
