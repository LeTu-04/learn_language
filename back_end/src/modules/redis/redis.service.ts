import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from 'ioredis'
import redisConfig from "../../auth/config/redis.config";
import type { ConfigType } from "@nestjs/config";
import { GenerateHashService } from "../../utils/hash.utils";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;

    constructor(
        @Inject(redisConfig.KEY)
        private redisCfg: ConfigType<typeof redisConfig>,
        private readonly hash: GenerateHashService

    ) { }

    onModuleInit() {
        this.redis = new Redis({
            host: this.redisCfg.redis_host,
            port: parseInt(this.redisCfg.redis_port!, 10),
            password: this.redisCfg.redis_password
        })
        console.log('✅ Redis connected to host:', this.redisCfg.redis_host);
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }

    async setEmailOtp(email: string, otp: string) {
        const otpHashed =  this.hash.createHmacForOtpValue(email, otp);
        await this.redis.set(`otp:${email}`, otpHashed, 'EX', 180)
    }

    async getEmailOpt(email: string): Promise<string | null> {
        return await this.redis.get(`otp:${email}`);
    }

    async deleteOtp(email: string) {
        await this.redis.del(`otp:${email}`)
    }
}