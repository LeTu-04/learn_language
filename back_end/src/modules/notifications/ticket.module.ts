import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { RedisModule } from "../redis/redis.module";
import { TicketController } from "./ticket.controller";
import { NotifiCationService } from "./notification.service";
import { PrismaModule } from "../../Prisma/prisma.module";

@Module({
    imports : [RedisModule, PrismaModule],
    controllers: [TicketController],
    providers : [TicketService, NotifiCationService],
    exports : [TicketService, NotifiCationService]
})

export class TicketModule {}