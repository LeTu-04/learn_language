import { ForbiddenException, Injectable, MessageEvent } from "@nestjs/common";
import { filter, interval, map, merge, Observable, Subject } from "rxjs";
import { PrismaService } from "../../Prisma/prisma.service";

export interface notificationPayload {
    id: string;
    userId: string;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    postId?: number
}

@Injectable()
export class NotifiCationService {
    constructor(private readonly prisma: PrismaService) { }
    private readonly notification$ = new Subject<notificationPayload>();
    subscribe(userId: string): Observable<MessageEvent> {
        const userNotifications$ = this.notification$.asObservable().pipe(
            filter((event) => event.userId === userId),
            map((event) => ({
                data: {
                    id: event.id,
                    title: event.title,
                    content: event.content,
                    isRead: event.isRead,
                    createdAt: event.createdAt,
                    postId: event.postId
                }
            } as MessageEvent))

        );
        const heartbeat$ = interval(25000).pipe(
            map(() => ({
                type : 'ping',
                data : 'keep-alive'
            }as MessageEvent))
        );
        return merge(userNotifications$, heartbeat$);
    }

    async pushNotification(userId: string, title: string, content: string, postId?: number) {
        const newNotify = await this.prisma.notification.create({
            data: {
                userId,
                title,
                content,
                postId
            }
        })
        this.notification$.next({
            id: newNotify.id,
            userId: newNotify.userId,
            title: newNotify.title,
            content: newNotify.content,
            isRead: newNotify.isRead,
            createdAt: newNotify.createdAt,
            postId: newNotify.postId ? postId : undefined
        })
    }

    async getNotification(userId: string, cursor?: string, limit: number = 20,) {
        const data = await this.prisma.notification.findMany({
            where: {
                userId
            },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' }
        });
        let nextCursor: string | null = null;
        if (data.length === limit) {
            nextCursor = data[data.length - 1].id
        }
        return {
            data,
            nextCursor
        }
    }

    async makeAsRead(id: string, userId: string) {
        const result = await this.prisma.notification.updateMany({
            where: { id, userId, isRead: false },
            data: { isRead: true }
        });

        if (result.count === 0) {
            throw new ForbiddenException('Không thể update thông báo này')
        }
    }
}