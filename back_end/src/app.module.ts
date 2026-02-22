import { Module } from '@nestjs/common';
import { VocabController } from './controllers/vocab/vocab/vocab.controller.js';
import { VocabService } from './services/vocab/vocab/vocab.service.js';
import { PrismaService } from './Prisma/prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    })
  ],
  controllers: [ VocabController, CategoryController],
  providers: [VocabService, PrismaService, CategoryService],
})
export class AppModule {}
