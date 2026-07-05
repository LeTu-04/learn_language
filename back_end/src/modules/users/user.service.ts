import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../Prisma/prisma.service";

import * as argon2 from 'argon2';
import { MailService } from "../mail/mail.service";
import { RedisService } from "../redis/redis.service";
import { GenerateHashService } from "../../utils/hash.utils";
import { CloudinaryService } from "../upload/cloudinary.service";


@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mail: MailService,
        private readonly redis: RedisService,
        private readonly hash: GenerateHashService,
        private readonly cloud: CloudinaryService
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
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            image_url: true,
                            createdAt: true,
                        }
                    },
                    avatarUrl: true,
                    name: true
                },
            });
            return postResponse;
        } catch (error) {
            throw error;
        }
    }
    async likePost(postId: number, userId: string) {
        try {
            return await this.prisma.$transaction(async (tx) => {
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
                    return { isLiked: false };
                } else {
                    await tx.heartEmoji.create({
                        data: {
                            authorId: userId,
                            postId
                        }
                    });
                    return { isLiked: true };
                }
            })
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
                    }
                }
            });
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
