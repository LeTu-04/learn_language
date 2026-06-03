import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CloudinaryService } from '../../modules/upload/cloudinary.service';

export interface CreatePostDto {
    title?: string,
    content: string,
    file?: Express.Multer.File
}

@Injectable()
export class DiscussService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ) { }

    async createPost(data: CreatePostDto, userId: string) {
        let image_url: string | undefined = undefined;
        let public_id: string | undefined = undefined;
        if (data.file) {
            const result = await this.cloudinary.uploadImages(data.file);
            image_url = result.secure_url;
            public_id = result.public_id;
        }

        const newPostCreated = await this.prisma.post.create({
            data: {
                authorId: userId,
                title: data.title,
                content: data.content,
                image_public_id: public_id,
                image_url: image_url

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
               // skip: 1
            }),
            take: limit + 1,
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

        let nextCursor : number | null = null;
        if(postData.length > limit) {
            const lastItem = postData.pop();
            nextCursor = lastItem ? lastItem.id : null;
        }
        


        return {
            postData,
            cursor: nextCursor
        }
    }
}
