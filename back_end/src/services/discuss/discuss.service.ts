import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';

export interface CreatePostDto {
    title?: string,
    content: string
}

@Injectable()
export class DiscussService {
    constructor(private readonly prisma: PrismaService) { }

    async createPost(data: CreatePostDto, userId: string) {
        const newPostCreated = await this.prisma.post.create({
            data: {
                authorId: userId,
                title: data.title,
                content: data.content
            }
        });
        return data;
    }

    async fetchAllPost(cursor: number | undefined, limit: number = 10) {

        if (!cursor) {
            cursor = undefined
        }
        const postData = await this.prisma.post.findMany({
            // where: {
            //     id: { gt: cursor },
            // },
            orderBy: { id: 'desc' },
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1
            }),
            take: limit,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        const data = postData.pop();
        const nextCursor = postData.length > limit ? data?.id : null;


        return {
            postData,
            cursor: nextCursor
        }
    }
}
