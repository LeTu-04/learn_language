import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../Prisma/prisma.service";

import * as argon2 from 'argon2';
import { MailService } from "../mail/mail.service";
import { RedisService } from "../redis/redis.service";
import { GenerateHashService } from "../../utils/hash.utils";
import { CloudinaryService } from "../upload/cloudinary.service";
import { NotifiCationService } from "../notifications/notification.service";
import { title } from "process";


@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mail: MailService,
        private readonly redis: RedisService,
        private readonly hash: GenerateHashService,
        private readonly cloud: CloudinaryService,
        private readonly notification: NotifiCationService
    ) { }

    async getDetailUser(userId: string) {
        if (!userId) {
            throw new BadRequestException('Thiếu id user');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new NotFoundException('Không tìm thấy thông tin user');
        }
        const { password, isActive, ...userInfo } = user;
        return userInfo;

    }

    async UpdateNameProfile(userId: string, newName: string) {
        if (!newName) return;
        const isExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!isExists) {
            throw new BadRequestException('Thiếu id user');
        }

        const userData = await this.prisma.user.update({
            where: { id: userId },
            data: { name: newName }
        });

        const { password, isActive, ...dataAfterChangeName } = userData;

        return dataAfterChangeName;

    }

    async changePassword(oldPassword: string, newPassword: string, userId: string) {
        if (!newPassword) return;
        const isExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!isExists) {
            throw new BadRequestException('Thiếu id user');
        }

        const userInfo = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });
        const oldPasswordIsOk = await argon2.verify(userInfo?.password!, oldPassword);
        if (!oldPasswordIsOk) {
            throw new BadRequestException('Mật khẩu cũ không chính xác')
        }

        const passwordRequire = newPassword.length >= 6;
        if (!passwordRequire) {
            throw new BadRequestException('Mật khẩu phải chứa ít nhất 6 ký tự');
        }

        const passwordHashed = await argon2.hash(newPassword);

        const data = await this.prisma.user.update({
            where: { id: userId },
            data: { password: passwordHashed },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                deletedAt: true
            }
        });
        return data;

    }


    async changeAvatar(file: Express.Multer.File, userId: string,) {
        if (!userId) {
            throw new UnauthorizedException('Thông tin không hợp lệ');
        }
        if (!file) {
            throw new BadRequestException('Thiếu file ảnh');
        }
        const response = await this.cloud.uploadImages(file, 'learning_english/avatar', `user${userId}`);
        const avatarUrl = `${response.secure_url}?v=${Date.now()}`;

        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    avatarUrl
                }
            });
            return avatarUrl;
        } catch (error) {
            throw error;
        }
    }

    async getALlPostOfUser(userId: string) {
        try {
            const postResponse = await this.prisma.user.findUnique({
                where: { id: userId, isActive: true },
                select: {
                    posts: {
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            image_url: true,
                            createdAt: true,
                            _count: {
                                select: {
                                    heartEmojis: true,
                                    comments: true
                                }
                            },
                            heartEmojis: {
                                where: { authorId: userId },
                                select: { authorId: true }
                            }
                        }
                    },
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                },
            });

            if (!postResponse) return null;

            const formatedPosts = postResponse.posts.map((post) => {
                const { heartEmojis, _count, ...postDetail } = post;
                return {
                    ...postDetail,
                    likecount: {
                        heartCount: _count.heartEmojis,
                        commentCount: _count.comments
                    },
                    isLiked: heartEmojis.length > 0
                };
            });

            return {
                posts: formatedPosts,
                avatarUrl: postResponse.avatarUrl,
                name: postResponse.name
            };
        } catch (error) {
            throw error;
        }
    }

    async getCommentMyPost(postId: number) {
        try {
            const response = await this.prisma.comment.findMany({
                where: { postId },
                select: {
                    id: true,
                    content: true,
                    postId: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            avatarUrl: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async likePost(postId: number, userId: string) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {

                const isLiked = await tx.heartEmoji.findUnique({
                    where: {
                        authorId_postId: {
                            authorId: userId,
                            postId
                        }
                    }
                });
                if (isLiked) {
                    await tx.heartEmoji.delete({
                        where: {
                            authorId_postId: {
                                authorId: userId,
                                postId
                            }
                        }
                    });
                    return { isLiked: false, authorId: null };
                } else {
                    await tx.heartEmoji.create({
                        data: {
                            authorId: userId,
                            postId
                        }
                    });
                    const post = await tx.post.findUnique({
                        where: { id: postId },
                        select: { authorId: true }
                    })
                    return { isLiked: true, authorId: post?.authorId };
                }
            });
            if (result.isLiked && result.authorId && result.authorId !== userId) {
                const liker = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: { name: true, email: true }
                })
                await this.notification.pushNotification(
                    result.authorId,
                    'Lượt thích mới',
                    `${liker?.name ? liker.name : liker?.email} đã thích bài viết của bạn`,
                    postId
                )
            }
            return { isLiked: result.isLiked };
        } catch (error) {
            throw error;
        }
    }

    async createComment(postId: number, userId: string, content: string) {
        try {
            const comment = await this.prisma.comment.create({
                data: {
                    postId,
                    content,
                    authorId: userId
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true
                        }
                    },
                    post: {
                        select: { authorId: true }
                    }
                }
            });

            if (comment.post.authorId !== userId) {
                const { post, ...commentData } = comment;
                await this.notification.pushNotification(
                    comment.post.authorId,
                    'Bạn có một bình luận mới',
                    `${comment.author.name || comment.author.email} đã bình luận : ${content.slice(0, 30)}...`,
                    postId,
                    commentData
                )
            }
            return comment;
        } catch (error) {
            throw error;
        }
    }

    async getComment(postId: number) {
        try {
            const response = await this.prisma.comment.findMany({
                where: { postId },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }




}
