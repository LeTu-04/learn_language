import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';
import redisConfig from '../../auth/config/redis.config.js';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (redisCfg: ConfigType<typeof redisConfig>) => ({
        connection: {
          host: redisCfg.redis_host,
          port: parseInt(redisCfg.redis_port!, 10),
          password: redisCfg.redis_password,
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
