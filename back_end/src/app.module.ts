import { Module } from '@nestjs/common';
import { VocabController } from './controllers/vocab/vocab/vocab.controller.js';
import { VocabService } from './services/vocab/vocab/vocab.service.js';
import { PrismaService } from './Prisma/prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { AuthModule } from './auth/auth/auth.module';
import { GoogleService } from './auth/service/auth/google.service.js';
import { AuthController } from './auth/controller/auth/auth.controller';
import { Token } from './auth/token/token.js';
import jwtConfig from './auth/config/jwt.config.js';
import { PrismaModule } from './Prisma/prisma.module.js';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwtaccess.guard.js';
import { JwtService } from './auth/service/jwt/jwt.service';
import { LocalService } from './auth/service/auth/local/local.service';


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




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig, redisConfig, hashConfig, mailConfig]
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
