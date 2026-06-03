import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { GenerateHashService } from "../../utils/hash.utils";

@Module({
    providers : [RedisService, GenerateHashService],
    exports : [RedisService]
})

export class RedisModule {}