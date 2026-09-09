import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../Prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { GenerateHashService } from '../../utils/hash.utils';
import { CloudinaryService } from '../upload/cloudinary.service';
import { NotifiCationService } from '../notifications/notification.service';

jest.mock('argon2', () => ({
    verify: jest.fn(),
    hash: jest.fn(),
}));
import * as argon2 from 'argon2';


const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    comment: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
    heartEmoji: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
    post: {
        findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
};

const mockMail = { sendOtp: jest.fn() };
const mockRedis = { get: jest.fn(), set: jest.fn() };
const mockHash = { createHmacForOtpValue: jest.fn(), generateOtp: jest.fn() };
const mockCloud = { uploadImages: jest.fn() };
const mockNotification = { pushNotification: jest.fn() };


const USER_ID = 'user-001';
const mockUser = {
    id: USER_ID,
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'hashedPassword',
    avatarUrl: null,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    deletedAt: null,
    totalVocabLearn: 10,
    currentStreak: 3,
    longestStreak: 5,
};


describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: MailService, useValue: mockMail },
                { provide: RedisService, useValue: mockRedis },
                { provide: GenerateHashService, useValue: mockHash },
                { provide: CloudinaryService, useValue: mockCloud },
                { provide: NotifiCationService, useValue: mockNotification },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        jest.clearAllMocks();
    });


    describe('getDetailUser', () => {
        it('trả về thông tin user, loại bỏ password và isActive', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getDetailUser(USER_ID);

            expect(result).not.toHaveProperty('password');
            expect(result).not.toHaveProperty('isActive');
            expect(result).toHaveProperty('id', USER_ID);
            expect(result).toHaveProperty('email', 'test@gmail.com');
        });

        it('ném BadRequestException khi userId rỗng', async () => {
            await expect(service.getDetailUser('')).rejects.toThrow(
                new BadRequestException('Thiếu id user')
            );
            expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
        });

        it('ném NotFoundException khi user không tồn tại', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(service.getDetailUser(USER_ID)).rejects.toThrow(
                new NotFoundException('Không tìm thấy thông tin user')
            );
        });
    });

    describe('UpdateNameProfile', () => {
        it('cập nhật tên thành công, trả về data không có password và isActive', async () => {
            const updatedUser = { ...mockUser, name: 'New Name' };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue(updatedUser);

            const result = await service.UpdateNameProfile(USER_ID, 'New Name');

            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { name: 'New Name' },
            });
            expect(result).not.toHaveProperty('password');
            expect(result).not.toHaveProperty('isActive');
        });

        it('return undefined khi newName rỗng (không làm gì)', async () => {
            const result = await service.UpdateNameProfile(USER_ID, '');

            expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it('ném BadRequestException khi user không tồn tại', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(service.UpdateNameProfile(USER_ID, 'New Name')).rejects.toThrow(
                new BadRequestException('Thiếu id user')
            );
            expect(mockPrisma.user.update).not.toHaveBeenCalled();
        });
    });


    describe('changePassword', () => {
        it('đổi mật khẩu thành công', async () => {
            const updatedData = { id: USER_ID, name: 'Test', email: 'test@gmail.com', avatarUrl: null, createdAt: new Date(), deletedAt: null };
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce({ password: 'hashedPassword' });
            (argon2.verify as jest.Mock).mockResolvedValue(true);
            (argon2.hash as jest.Mock).mockResolvedValue('newHashedPassword');
            mockPrisma.user.update.mockResolvedValue(updatedData);

            const result = await service.changePassword('oldPass', 'newPass123', USER_ID);

            expect(argon2.verify).toHaveBeenCalledWith('hashedPassword', 'oldPass');
            expect(argon2.hash).toHaveBeenCalledWith('newPass123');
            expect(result).toEqual(updatedData);
        });

        it('return undefined khi newPassword rỗng', async () => {
            const result = await service.changePassword('oldPass', '', USER_ID);

            expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it('ném BadRequestException khi user không tồn tại', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(service.changePassword('old', 'newPass123', USER_ID)).rejects.toThrow(
                new BadRequestException('Thiếu id user')
            );
        });

        it('ném BadRequestException khi mật khẩu cũ sai', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce({ password: 'hashedPassword' });
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            await expect(service.changePassword('wrongOld', 'newPass123', USER_ID)).rejects.toThrow(
                new BadRequestException('Mật khẩu cũ không chính xác')
            );
            expect(argon2.hash).not.toHaveBeenCalled();
        });

        it('ném BadRequestException khi mật khẩu mới ít hơn 6 ký tự', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce({ password: 'hashedPassword' });
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            await expect(service.changePassword('oldPass', '123', USER_ID)).rejects.toThrow(
                new BadRequestException('Mật khẩu phải chứa ít nhất 6 ký tự')
            );
        });
    });


    describe('changeAvatar', () => {
        const mockFile = { originalname: 'avatar.jpg', buffer: Buffer.from('') } as Express.Multer.File;

        it('upload ảnh thành công, cập nhật avatarUrl', async () => {
            mockCloud.uploadImages.mockResolvedValue({ secure_url: 'https://cdn.example.com/avatar.jpg' });
            mockPrisma.user.update.mockResolvedValue(mockUser);

            const result = await service.changeAvatar(mockFile, USER_ID);

            expect(mockCloud.uploadImages).toHaveBeenCalledWith(
                mockFile,
                'learning_english/avatar',
                `user${USER_ID}`
            );
            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(result).toContain('https://cdn.example.com/avatar.jpg');
        });

        it('ném UnauthorizedException khi userId rỗng', async () => {
            await expect(service.changeAvatar(mockFile, '')).rejects.toThrow(
                new UnauthorizedException('Thông tin không hợp lệ')
            );
            expect(mockCloud.uploadImages).not.toHaveBeenCalled();
        });

        it('ném BadRequestException khi file không tồn tại', async () => {
            await expect(service.changeAvatar(null as any, USER_ID)).rejects.toThrow(
                new BadRequestException('Thiếu file ảnh')
            );
        });
    });


    describe('getALlPostOfUser', () => {
        it('trả về danh sách post đã được format', async () => {
            const rawPost = {
                id: 1,
                title: 'Hello',
                content: 'World',
                image_url: null,
                createdAt: new Date(),
                _count: { heartEmojis: 3, comments: 2 },
                heartEmojis: [{ authorId: USER_ID }],
            };
            mockPrisma.user.findUnique.mockResolvedValue({
                id: USER_ID,
                name: 'Test User',
                email: 'test@gmail.com',
                avatarUrl: null,
                posts: [rawPost],
            });

            const result = await service.getALlPostOfUser(USER_ID);

            expect(result?.posts[0]).toHaveProperty('likecount');
            expect(result?.posts[0].likecount).toEqual({ heartCount: 3, commentCount: 2 });
            expect(result?.posts[0].isLiked).toBe(true);
            expect(result?.posts[0]).not.toHaveProperty('heartEmojis');
            expect(result?.posts[0]).not.toHaveProperty('_count');
        });

        it('trả về null khi user không tồn tại hoặc không active', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await service.getALlPostOfUser(USER_ID);

            expect(result).toBeNull();
        });

        it('isLiked = false khi user chưa like bài', async () => {
            const rawPost = {
                id: 2,
                title: 'Test',
                content: 'Content',
                image_url: null,
                createdAt: new Date(),
                _count: { heartEmojis: 0, comments: 0 },
                heartEmojis: [], // chưa like
            };
            mockPrisma.user.findUnique.mockResolvedValue({
                id: USER_ID,
                name: 'Test',
                email: 'test@gmail.com',
                avatarUrl: null,
                posts: [rawPost],
            });

            const result = await service.getALlPostOfUser(USER_ID);

            expect(result?.posts[0].isLiked).toBe(false);
        });
    });


    describe('getCommentMyPost', () => {
        it('trả về danh sách comment của post', async () => {
            const mockComments = [
                { id: 1, content: 'Nice!', postId: 1, createdAt: new Date(), author: { id: USER_ID, email: 'a@b.com', name: 'A', avatarUrl: null } },
            ];
            mockPrisma.comment.findMany.mockResolvedValue(mockComments);

            const result = await service.getCommentMyPost(1);

            expect(result).toEqual(mockComments);
            expect(mockPrisma.comment.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { postId: 1 } })
            );
        });
    });


    describe('likePost', () => {
        const POST_ID = 99;

        it('like bài khi chưa like, push notification cho tác giả', async () => {
            const AUTHOR_ID = 'author-002';
            mockPrisma.$transaction.mockImplementation(async (fn: any) => {
                const tx = {
                    heartEmoji: {
                        findUnique: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn(),
                    },
                    post: {
                        findUnique: jest.fn().mockResolvedValue({ authorId: AUTHOR_ID }),
                    },
                };
                return fn(tx);
            });
            mockPrisma.user.findUnique.mockResolvedValue({ name: 'Liker', email: 'liker@gmail.com' });
            mockNotification.pushNotification.mockResolvedValue(undefined);

            const result = await service.likePost(POST_ID, USER_ID);

            expect(result).toEqual({ isLiked: true });
            expect(mockNotification.pushNotification).toHaveBeenCalledWith(
                AUTHOR_ID,
                'Lượt thích mới',
                expect.stringContaining('đã thích bài viết'),
                POST_ID
            );
        });

        it('unlike bài khi đã like, không push notification', async () => {
            mockPrisma.$transaction.mockImplementation(async (fn: any) => {
                const tx = {
                    heartEmoji: {
                        findUnique: jest.fn().mockResolvedValue({ authorId: USER_ID, postId: POST_ID }),
                        delete: jest.fn().mockResolvedValue(undefined),
                        create: jest.fn(),
                    },
                    post: { findUnique: jest.fn() },
                };
                return fn(tx);
            });

            const result = await service.likePost(POST_ID, USER_ID);

            expect(result).toEqual({ isLiked: false });
            expect(mockNotification.pushNotification).not.toHaveBeenCalled();
        });

        it('không push notification khi tự like bài của chính mình', async () => {
            mockPrisma.$transaction.mockImplementation(async (fn: any) => {
                const tx = {
                    heartEmoji: {
                        findUnique: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn(),
                    },
                    post: {
                        findUnique: jest.fn().mockResolvedValue({ authorId: USER_ID }), // cùng userId
                    },
                };
                return fn(tx);
            });

            const result = await service.likePost(POST_ID, USER_ID);

            expect(result).toEqual({ isLiked: true });
            expect(mockNotification.pushNotification).not.toHaveBeenCalled();
        });
    });


    describe('createComment', () => {
        const POST_ID = 10;
        const AUTHOR_ID = 'author-003';

        it('tạo comment và push notification cho tác giả bài viết', async () => {
            const mockComment = {
                id: 1,
                content: 'Hay lắm!',
                postId: POST_ID,
                authorId: USER_ID,
                author: { id: USER_ID, name: 'Commenter', email: 'c@test.com', avatarUrl: null },
                post: { authorId: AUTHOR_ID },
            };
            mockPrisma.comment.create.mockResolvedValue(mockComment);
            mockNotification.pushNotification.mockResolvedValue(undefined);

            const result = await service.createComment(POST_ID, USER_ID, 'Hay lắm!');

            expect(result).toEqual(mockComment);
            expect(mockNotification.pushNotification).toHaveBeenCalledWith(
                AUTHOR_ID,
                'Bạn có một bình luận mới',
                expect.stringContaining('đã bình luận'),
                POST_ID,
                expect.any(Object)
            );
        });

        it('không push notification khi tự comment bài của mình', async () => {
            const mockComment = {
                id: 2,
                content: 'Tôi comment bài của tôi',
                postId: POST_ID,
                authorId: USER_ID,
                author: { id: USER_ID, name: 'Me', email: 'me@test.com', avatarUrl: null },
                post: { authorId: USER_ID },
            };
            mockPrisma.comment.create.mockResolvedValue(mockComment);

            await service.createComment(POST_ID, USER_ID, 'Tôi comment bài của tôi');

            expect(mockNotification.pushNotification).not.toHaveBeenCalled();
        });
    });


    describe('getComment', () => {
        it('trả về danh sách comment kèm thông tin tác giả, sắp xếp asc', async () => {
            const mockComments = [
                { id: 1, content: 'First', author: { id: 'u1', name: 'A', email: 'a@b.com', avatarUrl: null } },
                { id: 2, content: 'Second', author: { id: 'u2', name: 'B', email: 'b@b.com', avatarUrl: null } },
            ];
            mockPrisma.comment.findMany.mockResolvedValue(mockComments);

            const result = await service.getComment(5);

            expect(mockPrisma.comment.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { postId: 5 },
                    orderBy: { createdAt: 'asc' },
                })
            );
            expect(result).toHaveLength(2);
        });

        it('trả về mảng rỗng khi không có comment', async () => {
            mockPrisma.comment.findMany.mockResolvedValue([]);

            const result = await service.getComment(5);

            expect(result).toEqual([]);
        });
    });
});
