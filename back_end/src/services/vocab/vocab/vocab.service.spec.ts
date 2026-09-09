import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { VocabService } from './vocab.service';
import { PrismaService } from '../../../Prisma/prisma.service';

const mockPrisma = {
    category: {
        findFirst: jest.fn(),
    },
    vocabulary: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

const USER_ID = 'user-xyz-456';
const CATEGORY_ID = 10;
const VOCAB_ID = 100;

const mockVocab = {
    id: VOCAB_ID,
    word: 'apple',
    mean: 'táo',
    example: 'I eat an apple',
    categoryId: CATEGORY_ID,
    isFavorite: false,
    createdAt: new Date('2024-01-01'),
};

const mockCategory = {
    id: CATEGORY_ID,
    name: 'Test Category',
    userId: USER_ID,
    isDeleted: false,
};

describe('VocabService', () => {
    let service: VocabService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VocabService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<VocabService>(VocabService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        const dto = { word: 'apple', mean: 'táo', example: 'I eat an apple' };

        it('tạo vocab thành công, trả về vocab và count', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
            mockPrisma.$transaction.mockResolvedValue([mockVocab, 5, { totalVocabLearn: 6 }]);

            const result = await service.create(CATEGORY_ID, dto, USER_ID);

            expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
                where: { id: CATEGORY_ID, userId: USER_ID },
            });
            expect(result).toEqual({ vocabulary: mockVocab, countVocabulary: 5 });
        });

        it('ném UnauthorizedException khi userId rỗng', async () => {
            await expect(service.create(CATEGORY_ID, dto, '')).rejects.toThrow(
                new UnauthorizedException('Không có userId')
            );
            expect(mockPrisma.category.findFirst).not.toHaveBeenCalled();
        });

        it('ném BadRequestException khi categoryId là 0 (falsy)', async () => {
            await expect(service.create(0, dto, USER_ID)).rejects.toThrow(
                new BadRequestException('Không thể thêm dữ liệu khi không có categoryId')
            );
            expect(mockPrisma.category.findFirst).not.toHaveBeenCalled();
        });

        it('ném NotFoundException khi category không tồn tại', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(null);

            await expect(service.create(CATEGORY_ID, dto, USER_ID)).rejects.toThrow(
                new NotFoundException('Không tìm thấy Category')
            );
        });

        it('ném Error khi $transaction thất bại', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
            mockPrisma.$transaction.mockRejectedValue(new Error('DB error'));

            await expect(service.create(CATEGORY_ID, dto, USER_ID)).rejects.toThrow(
                'Không thể thêm từ vựng'
            );
        });
    });

    describe('fetch', () => {
        it('trả về danh sách vocab của category', async () => {
            const mockResult = { vocabulary: [mockVocab] };
            mockPrisma.category.findFirst
                .mockResolvedValueOnce(mockCategory)
                .mockResolvedValueOnce(mockResult);

            const result = await service.fetch(CATEGORY_ID, USER_ID);

            expect(result).toEqual(mockResult);
            expect(mockPrisma.category.findFirst).toHaveBeenCalledTimes(2);
        });

        it('ném NotFoundException khi category không thuộc user', async () => {
            mockPrisma.category.findFirst.mockResolvedValue(null);

            await expect(service.fetch(CATEGORY_ID, USER_ID)).rejects.toThrow(
                new NotFoundException('Không tìm thấy folder cho tệp này')
            );
        });
    });

    describe('delete', () => {
        it('xoá vocab thành công và giảm totalVocabLearn', async () => {
            const mockTx = {
                vocabulary: { delete: jest.fn().mockResolvedValue(undefined) },
                user: {
                    findUnique: jest.fn().mockResolvedValue({ totalVocabLearn: 5 }),
                    update: jest.fn().mockResolvedValue(undefined),
                },
            };
            mockPrisma.$transaction
                .mockResolvedValueOnce([mockCategory, mockVocab])
                .mockImplementationOnce(async (fn: any) => fn(mockTx));

            await expect(service.delete(CATEGORY_ID, VOCAB_ID, USER_ID)).resolves.not.toThrow();

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { totalVocabLearn: 4 }, // 5 - 1
            });
        });

        it('ném Error khi category không tồn tại', async () => {
            mockPrisma.$transaction.mockResolvedValueOnce([null, mockVocab]);

            await expect(service.delete(CATEGORY_ID, VOCAB_ID, USER_ID)).rejects.toThrow(
                'Có lỗi, không xóa được'
            );
        });

        it('ném Error khi vocab không tồn tại', async () => {
            mockPrisma.$transaction.mockResolvedValueOnce([mockCategory, null]);

            await expect(service.delete(CATEGORY_ID, VOCAB_ID, USER_ID)).rejects.toThrow(
                'Có lỗi, không xóa được'
            );
        });

        it('totalVocabLearn không âm khi đang là 0', async () => {
            const mockTx = {
                vocabulary: { delete: jest.fn().mockResolvedValue(undefined) },
                user: {
                    findUnique: jest.fn().mockResolvedValue({ totalVocabLearn: 0 }),
                    update: jest.fn().mockResolvedValue(undefined),
                },
            };
            mockPrisma.$transaction
                .mockResolvedValueOnce([mockCategory, mockVocab])
                .mockImplementationOnce(async (fn: any) => fn(mockTx));

            await service.delete(CATEGORY_ID, VOCAB_ID, USER_ID);

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: USER_ID },
                data: { totalVocabLearn: 0 }, // Math.max(0, 0-1) = 0
            });
        });
    });

    describe('updateFavoriteVocab', () => {
        it('gọi $transaction với đúng số lần update theo changes', async () => {
            const changes = [
                { id: 10, isFavorite: true },
                { id: 20, isFavorite: false },
            ];
            mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops));
            mockPrisma.vocabulary.update
                .mockResolvedValueOnce(undefined)
                .mockResolvedValueOnce(undefined);

            await service.updateFavoriteVocab({ changes });

            expect(mockPrisma.vocabulary.update).toHaveBeenCalledTimes(2);
            expect(mockPrisma.vocabulary.update).toHaveBeenCalledWith({
                where: { id: 10 },
                data: { isFavorite: true },
            });
            expect(mockPrisma.vocabulary.update).toHaveBeenCalledWith({
                where: { id: 20 },
                data: { isFavorite: false },
            });
        });

        it('hoạt động với danh sách rỗng (không gọi update)', async () => {
            mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops));

            await service.updateFavoriteVocab({ changes: [] });

            expect(mockPrisma.vocabulary.update).not.toHaveBeenCalled();
        });
    });

    describe('shuffleArray', () => {
        it('trả về mảng có cùng số phần tử', () => {
            const input = [1, 2, 3, 4, 5];
            const result = service.shuffleArray(input);

            expect(result).toHaveLength(input.length);
        });

        it('chứa đúng các phần tử ban đầu (không thêm/bớt)', () => {
            const input = ['a', 'b', 'c', 'd'];
            const result = service.shuffleArray(input);

            expect(result.sort()).toEqual([...input].sort());
        });

        it('không thay đổi mảng gốc (immutable)', () => {
            const input = [1, 2, 3];
            const original = [...input];
            service.shuffleArray(input);

            expect(input).toEqual(original);
        });

        it('hoạt động với mảng rỗng', () => {
            expect(service.shuffleArray([])).toEqual([]);
        });

        it('hoạt động với mảng 1 phần tử', () => {
            expect(service.shuffleArray([42])).toEqual([42]);
        });
    });

    describe('fetchAllFavorites', () => {
        it('trả về danh sách vocab yêu thích của user', async () => {
            const favVocabs = [
                { ...mockVocab, isFavorite: true },
                { ...mockVocab, id: 101, word: 'book', mean: 'sách', isFavorite: true },
            ];
            mockPrisma.vocabulary.findMany.mockResolvedValue(favVocabs);

            const result = await service.fetchAllFavorites(USER_ID);

            expect(mockPrisma.vocabulary.findMany).toHaveBeenCalledWith({
                where: {
                    isFavorite: true,
                    category: { userId: USER_ID, isDeleted: false },
                },
                orderBy: { createdAt: 'desc' },
            });
            expect(result).toEqual({ vocabulary: favVocabs });
            expect(result.vocabulary).toHaveLength(2);
        });

        it('trả về mảng rỗng khi không có vocab yêu thích', async () => {
            mockPrisma.vocabulary.findMany.mockResolvedValue([]);

            const result = await service.fetchAllFavorites(USER_ID);

            expect(result).toEqual({ vocabulary: [] });
        });

        it('ném UnauthorizedException khi userId rỗng', async () => {
            await expect(service.fetchAllFavorites('')).rejects.toThrow(
                new UnauthorizedException('Không có userId')
            );
            expect(mockPrisma.vocabulary.findMany).not.toHaveBeenCalled();
        });
    });
});
