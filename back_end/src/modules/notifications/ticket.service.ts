import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TicketService {
    constructor(private readonly redis : RedisService){}
    async generateTicketForSSE(userId : string) {
        const ticket = uuidv4();
        await this.redis.set(`sse:${ticket}`, userId, 15);
        return ticket;
    }

    async verifyTicketForSSE (ticket : string) : Promise <string|null> {
        const userId = await this.redis.get(`sse:${ticket}`);
        if(userId) {
            await this.redis.del(`sse:${ticket}`);
        }
        return userId;
    }
}