import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../../Prisma/prisma.service";
import { RedisService } from "../../modules/redis/redis.service";

@Injectable()
export class StreakInterCeptor implements NestInterceptor {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.userId) {
            const userId = user.userId;
            const redisKey = `user:active:${userId}`;
            const isAlreadyActiveToday = await this.redis.get(redisKey);
            if(!isAlreadyActiveToday) {
                await this.updateUserStreak(userId)
                const secondsUntilEndOfDay = this.getTimeUnitlEndOfDays();
                await this.redis.set(redisKey, 'true', secondsUntilEndOfDay)
            }
            
        }
        return next.handle();

    }

    private async updateUserStreak (userId : string) {
        const user = await this.prisma.user.findUnique({
            where : {id : userId},
            select : {
                currentStreak : true,
                longestStreak : true,
                lastActiveDay : true
            }
        });
        if(!user) {
            return
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let updatedStreakData = {}
        if(!user.lastActiveDay) {
            updatedStreakData = {
                currentStreak : 1,
                longestStreak : user.longestStreak > 0 ? user.longestStreak : 1,
                lastActiveDay : today
            }
            
        } else {
            const lastActiveDay = new Date(
                user.lastActiveDay.getFullYear(),
                user.lastActiveDay.getMonth(),
                user.lastActiveDay.getDate()
            );

            const diffTime = today.getTime() - lastActiveDay.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if(diffDays > 1) {
                updatedStreakData = {
                    currentStreak : 1,
                    lastActiveDay : today
                }
            } else if(diffDays === 1) {
                const newStreak = user.currentStreak + 1;
                updatedStreakData = {
                    currentStreak : newStreak,
                    longestStreak : newStreak > user.longestStreak ? newStreak : user.longestStreak,
                    lastActiveDay : today
                }
            }
           
        }

        if(Object.keys(updatedStreakData).length > 0) {
            await this.prisma.user.update({
                where : {id : userId},
                data : updatedStreakData
            })
        }

    }

    private getTimeUnitlEndOfDays () : number {
        const now = new Date();
        const endOfDays = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);
        return Math.max(1, Math.floor((endOfDays.getTime() - now.getTime()) / 1000));
    }

}