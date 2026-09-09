import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaService } from '../../Prisma/prisma.service';


const mockPrisma = {
    category: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
    vocabulary: {
        count: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};


const USER_ID = 'user-abc-123';
const CATEGORY_ID = 1;

const mockCategory = {
    id: CATEGORY_ID,
    name: 'Tiếng Anh cơ bản',
    userId: USER_ID,
    isDeleted: false,
    createdAt: new Date('2024-01-01'),
    deletedAt: null,
};



describe('CategoryService', () => {
    let service: CategoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        jest.clearAllMocks();
    });


    describe('createCategory', () => {
        it('tạo category thành công khi có đủ dữ liệu', async () => {
            mockPrisma.category.create.mockResolvedValue(mockCategory);

            const result = await service.createCategory({ name: 'Tiếng Anh cơ bản' }, USER_ID);

            expect(mockPrisma.category.create).toHaveBeenCalledWith({
                data: { name: 'Tiếng Anh cơ bản', userId: USER_ID },
            });
            expect(result).toEqual(mockCategory);
        });

        it('ném BadRequestException khi userId rỗng', async () => {
            await expect(
                service.createCategory({ name: 'Test' }, '')
            ).rejects.toThrow(new BadRequestException('USER_ID_MISSING'));

            expect(mockPrisma.category.create).not.toHaveBeenCalled();
        });
    });


    describe('fetchCategory', () => {
        it('trả về danh sách category chưa bị xoá, sắp xếp theo createdAt desc', async () => {
            const mockData = [mockCategory, { ...mockCategory, id: 2, name: 'TOEIC' }];
            mockPrisma.category.findMany.mockResolvedValue(mockData);

            const result = await service.fetchCategory(USER_ID);

            expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
                where: { isDeleted: false, userId: USER_ID },
                orderBy: { createdAt: 'desc' },
            });
            expect(result).toEqual(mockData);
        });

        it('trả về mảng rỗng khi không có category nào', async () => {
            mockPrisma.category.findMany.mockResolvedValue([]);

            const result = await service.fetchCategory(USER_ID);

            expect(result).toEqual([]);
        });
    });


    describe('softRemoveCategory', () => {
        it('soft delete category khi không có vocab nào trong đó', async () => {
            const mockTx = {
                vocabulary: { count: jest.fn().mockResolvedValue(0) },
                category: { update: jest.fn().mockResolvedValue(mockCategory) },
                user: { findUnique: jest.fn(), update: jest.fn() },
            };
            mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

            await service.softRemoveCategory(CATEGORY_ID, USER_ID);

            expect(mockTx.category.update).toHaveBeenCalledWith({
                where: { id: CATEGORY_ID, userId: USER_ID },
                data: { isDeleted: true, deletedAt: expect.any(Date) },
            });
            expect(mockTx.user.update).not.toHaveBeenCalled();
        });

        it('giảm totalVocabLearn của user khi category có vocab', async () => {
            const mockTx = {
                vocabulary: { count: jest.fn().mockResolvedValue(5) },
                category: { update: jest.fn().mockResolvedValue(undefined) },
                user: {
                    findUnique: jest.fn().mockResolvedValue({ totalVocabLearn: 10 }),
                    update: jest.fn().mockResolvedValue(undefined),
                },
            };
            mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

            await service.softRemoveCategory(CATEGORY_ID, USER_ID);

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { totalVocabLearn: 5 },
            });
        });

        it('totalVocabLearn không âm khi vocab nhiều hơn tổng hiện tại', async () => {
            const mockTx = {
                vocabulary: { count: jest.fn().mockResolvedValue(20) },
                category: { update: jest.fn().mockResolvedValue(undefined) },
                user: {
                    findUnique: jest.fn().mockResolvedValue({ totalVocabLearn: 5 }),
                    update: jest.fn().mockResolvedValue(undefined),
                },
            };
            mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

            await service.softRemoveCategory(CATEGORY_ID, USER_ID);

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { totalVocabLearn: 0 },
            });
        });
    });


    describe('updateCategory', () => {
        it('cập nhật tên category thành công', async () => {
            const updatedCategory = { ...mockCategory, name: 'Tên mới' };
            mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
            mockPrisma.category.update.mockResolvedValue(updatedCategory);

            const result = await service.updateCategory(CATEGORY_ID, { name: 'Tên mới' }, USER_ID);

            expect(mockPrisma.category.update).toHaveBeenCalledWith({
                where: { id: CATEGORY_ID, userId: USER_ID },
                data: { name: 'Tên mới' },
            });
            expect(result).toEqual(updatedCategory);
        });

        it('trả về category cũ khi tên không đổi (tránh update thừa)', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(mockCategory);

            const result = await service.updateCategory(
                CATEGORY_ID,
                { name: mockCategory.name },
                USER_ID
            );

            expect(mockPrisma.category.update).not.toHaveBeenCalled();
            expect(result).toEqual(mockCategory);
        });

        it('ném BadRequestException khi không tìm thấy category', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(null);

            await expect(
                service.updateCategory(CATEGORY_ID, { name: 'Tên mới' }, USER_ID)
            ).rejects.toThrow(new BadRequestException('Không tìm thấy Category'));
        });
    });


    describe('getAllCategoryRemoved', () => {
        it('trả về danh sách category đã xoá và loại bỏ trường userId', async () => {
            const deletedCategory = { ...mockCategory, isDeleted: true, deletedAt: new Date() };
            mockPrisma.category.findMany.mockResolvedValue([deletedCategory]);

            const result = await service.getAllCategoryRemoved(USER_ID);

            expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
                where: { userId: USER_ID, isDeleted: true },
            });
            expect(result[0]).not.toHaveProperty('userId');
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('name');
        });

        it('trả về mảng rỗng khi không có category nào trong thùng rác', async () => {
            mockPrisma.category.findMany.mockResolvedValue([]);

            const result = await service.getAllCategoryRemoved(USER_ID);

            expect(result).toEqual([]);
        });
    });

    describe('deletedCategoryInTrash', () => {
        it('xoá vĩnh viễn category trong thùng rác', async () => {
            mockPrisma.category.delete.mockResolvedValue(undefined);

            await service.deletedCategoryInTrash(CATEGORY_ID, USER_ID);

            expect(mockPrisma.category.delete).toHaveBeenCalledWith({
                where: { id: CATEGORY_ID, isDeleted: true, userId: USER_ID },
            });
        });

        it('ném lỗi khi prisma.delete thất bại', async () => {
            mockPrisma.category.delete.mockRejectedValue(new Error('Record not found'));

            await expect(
                service.deletedCategoryInTrash(CATEGORY_ID, USER_ID)
            ).rejects.toThrow('Record not found');
        });
    });


    describe('reStoreCategoryRemoved', () => {
        it('khôi phục category khi không có vocab', async () => {
            const mockTx = {
                vocabulary: { count: jest.fn().mockResolvedValue(0) },
                category: { update: jest.fn().mockResolvedValue(undefined) },
                user: { update: jest.fn() },
            };
            mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

            await service.reStoreCategoryRemoved(CATEGORY_ID, USER_ID);

            expect(mockTx.category.update).toHaveBeenCalledWith({
                where: { userId: USER_ID, id: CATEGORY_ID, isDeleted: true },
                data: { isDeleted: false },
            });
            expect(mockTx.user.update).not.toHaveBeenCalled();
        });

        it('tăng totalVocabLearn khi khôi phục category có vocab', async () => {
            const mockTx = {
                vocabulary: { count: jest.fn().mockResolvedValue(7) },
                category: { update: jest.fn().mockResolvedValue(undefined) },
                user: { update: jest.fn().mockResolvedValue(undefined) },
            };
            mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));

            await service.reStoreCategoryRemoved(CATEGORY_ID, USER_ID);

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { totalVocabLearn: { increment: 7 } },
            });
        });
    });


    describe('deletePermCategory', () => {
        it('xoá vĩnh viễn category (không cần điều kiện isDeleted)', async () => {
            mockPrisma.category.delete.mockResolvedValue(undefined);

            await service.deletePermCategory(CATEGORY_ID, USER_ID);

            expect(mockPrisma.category.delete).toHaveBeenCalledWith({
                where: { userId: USER_ID, id: CATEGORY_ID },
            });
        });

        it('ném lỗi khi xoá thất bại', async () => {
            mockPrisma.category.delete.mockRejectedValue(new Error('Delete failed'));

            await expect(
                service.deletePermCategory(CATEGORY_ID, USER_ID)
            ).rejects.toThrow('Delete failed');
        });
    });

    describe('getDetailCategoryRemoved', () => {
        it('trả về chi tiết category đã xoá kèm danh sách vocab', async () => {
            const mockDetail = {
                id: CATEGORY_ID,
                name: 'Tiếng Anh cơ bản',
                deletedAt: new Date(),
                vocabulary: [
                    { word: 'apple', mean: 'táo', example: 'I eat an apple' },
                    { word: 'book', mean: 'sách', example: 'She reads a book' },
                ],
            };
            mockPrisma.category.findUnique.mockResolvedValue(mockDetail);

            const result = await service.getDetailCategoryRemoved(CATEGORY_ID, USER_ID);

            expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: CATEGORY_ID, userId: USER_ID },
                select: {
                    id: true,
                    name: true,
                    deletedAt: true,
                    vocabulary: {
                        select: { word: true, mean: true, example: true },
                    },
                },
            });
            expect(result).toEqual(mockDetail);
            expect(result?.vocabulary).toHaveLength(2);
        });

        it('trả về null khi không tìm thấy category', async () => {
            mockPrisma.category.findUnique.mockResolvedValue(null);

            const result = await service.getDetailCategoryRemoved(999, USER_ID);

            expect(result).toBeNull();
        });
    });
});
