import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { GenerateHashService } from '../../utils/hash.utils';
import { CloudinaryModule } from '../upload/cloudinary.module';
import { TicketModule } from '../notifications/ticket.module';

@Module({
  imports : [MailModule, RedisModule, CloudinaryModule, TicketModule],
  controllers: [UserController],
  providers: [UserService,GenerateHashService],
  exports: [UserService],
})
export class UserModule {}
