import { Module } from '@nestjs/common';
import { VocabController } from './controllers/vocab/vocab/vocab.controller.js';
import { VocabService } from './services/vocab/vocab/vocab.service.js';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { AuthModule } from './auth/auth/auth.module';
import { PrismaModule } from './Prisma/prisma.module.js';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwtaccess.guard.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

import { DiscussController } from './controllers/discuss/discuss.controller';
import { DiscussService } from './services/discuss/discuss.service.js';
import { CloudinaryModule } from './modules/upload/cloudinary.module.js';
import cloudinaryConfig from './auth/config/cloudinary.config.js';
import { RedisModule } from './modules/redis/redis.module.js';
import { MailModule } from './modules/mail/mail.module.js';
import { UserModule } from './modules/users/user.module';
import { TicketModule } from './modules/notifications/ticket.module';
import redisConfig from './auth/config/redis.config.js';
import hashConfig from './auth/config/hash.config.js';
import mailConfig from './auth/config/mail.config.js';
import { StreakInterCeptor } from './utils/streak/streak.interceptor.js';
import { ResendModule } from './modules/resend/resend.module.js';
import { QueueModule } from './modules/queue/queue.module.js';
import { VocabImportModule } from './modules/vocab-import/vocab-import.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig, redisConfig, hashConfig, mailConfig]
    }),
    QueueModule,
    VocabImportModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 15,
        },
        {
          name: 'medium',
          ttl: 60000,
          limit: 100,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT!, 10),
          password: process.env.REDIS_PASSWORD,
        })
      ),
    }),
    AuthModule,
    PrismaModule,
    CloudinaryModule,
    RedisModule,
    MailModule,
    UserModule,
    TicketModule,
    ResendModule
  ],
  controllers: [VocabController, CategoryController, DiscussController,],
  providers: [VocabService, CategoryService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StreakInterCeptor,
    },
    DiscussService
  ],
})
export class AppModule { }
