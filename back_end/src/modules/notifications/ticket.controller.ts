import { Controller, Get, Param, Patch, Query, Req, Sse, UnauthorizedException } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import type { Request } from "express";
import { NotifiCationService } from "./notification.service";
import { Public } from "../../auth/decorators/jwt.public";


@Controller('notification')
export class TicketController {
    constructor(private readonly ticket: TicketService,
        private readonly notification: NotifiCationService
    ) { }

    @Get('ticket')
    async generateTicket(
        @Req() req: Request
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException();
        }
        const ticket = await this.ticket.generateTicketForSSE(req.user?.sub);
        return {
            message: 'SUCCESS',
            data: ticket
        }
    }

    @Public()
    @Sse('stream')
    async connectStream(
        @Query('ticket') ticket: string
    ) {
        if (!ticket) {
            throw new UnauthorizedException('Ticket is required')
        }
        const userId = await this.ticket.verifyTicketForSSE(ticket);
        if (!userId) {
            throw new UnauthorizedException('Invalid Ticket');
        }
        return this.notification.subscribe(userId)
    }

    @Get('list')
    async getNotifications(
        @Req() req: Request,
        @Query('limit') limit?: number,
        @Query('cursor') cursor?: string 
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException();
        }
        const { data, nextCursor } = await this.notification.getNotification(req.user.sub, cursor);
        return {
            message: 'SUCCESS',
            data,
            nextCursor
        }
    }

    @Patch('read/:id')
    async markAsRead(
        @Param('id') id: string,
        @Req() req: Request
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException();
        }
        return this.notification.makeAsRead(id, req.user.sub);
    }

}