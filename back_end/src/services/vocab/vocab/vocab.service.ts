import { PrismaService } from '../../../Prisma/prisma.service';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BathUpdateFavoriteDto, CreateVocabularyDto, UpdateFavorite } from '../../../types/vocabularies';
import { Prisma } from '../../../../prisma/client/client';


@Injectable()
export class VocabService {

    private readonly logger = new Logger(VocabService.name);
    constructor(private readonly prisma: PrismaService) { }

    async create(categoryId: number, data: CreateVocabularyDto, userId: string) {
        if (!userId) {
            throw new UnauthorizedException('Không có userId');
        }
        if (!categoryId) {
            throw new BadRequestException('Không thể thêm dữ liệu khi không có categoryId');
        }
        const CategoryExists = await this.prisma.category.findFirst({
            where: { id: categoryId, userId }
        });
        if (!CategoryExists) {
            throw new NotFoundException('Không tìm thấy Category')
        }

        const vocabularyData = { ...data, categoryId }
        try {
            const [vocabulary, countVocabulary] = await this.prisma.$transaction([
                this.prisma.vocabulary.create({
                    data: vocabularyData
                }),
                this.prisma.vocabulary.count({
                    where: {
                        categoryId: categoryId
                    }
                }),
                this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        totalVocabLearn: { increment: 1 }
                    }
                })
            ])
            this.logger.log(vocabulary);
            this.logger.log(countVocabulary);
            return {
                vocabulary,
                countVocabulary
            };

        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Dữ liệu không hợp lệ')
            }

            this.logger.error(`Có lỗi xảy ra khi thêm từ vựng ${error}`);
            throw new Error('Không thể thêm từ vựng');
        }
    }
    async fetch(categoryId: number, userId: string) {
        const isExists = await this.prisma.category.findFirst({
            where: { id: categoryId, userId }
        });
        if (!isExists) {
            throw new NotFoundException('Không tìm thấy folder cho tệp này');
        }
        const vocabularies = await this.prisma.category.findFirst({
            where: { id: categoryId, userId },
            select: {
                vocabulary: true
            }
        });
        return vocabularies
    }

    async delete(categoryId: number, vocabularyId: number, userId: string) {

        const [isCategoryExists, isVocabularyExists] = await this.prisma.$transaction([
            this.prisma.category.findFirst({
                where: { id: categoryId, isDeleted: false, userId }
            }),
            this.prisma.vocabulary.findFirst({
                where: { id: vocabularyId, categoryId }
            })
        ])

        try {
            if (!isCategoryExists || !isVocabularyExists) {
                throw new NotFoundException('Không tìm thấy dữ liệu');
            }
            await this.prisma.$transaction(async (tx) => {
                await tx.vocabulary.delete({
                    where: { id: vocabularyId, categoryId: categoryId }
                });

                const user = await tx.user.findUnique({
                    where: { id: userId },
                    select: { totalVocabLearn: true }
                });
                const currentTotal = user?.totalVocabLearn ?? 0;
                const newTotal = Math.max(0, currentTotal - 1);

                await tx.user.update({
                    where: { id: userId },
                    data: {
                        totalVocabLearn: newTotal
                    }
                });
            });

        } catch (error) {
            throw new Error('Có lỗi, không xóa được')
        }
    }

    async updateFavoriteVocab(data: BathUpdateFavoriteDto) {
        await this.prisma.$transaction(
            data.changes.map((item) =>
                this.prisma.vocabulary.update(
                    {
                        where: { id: item.id },
                        data: { isFavorite: item.isFavorite }
                    }
                )
            )
        )
    }


    shuffleArray<T>(array: T[]) {
        const shuffleArray = [...array];
        for (let i = shuffleArray.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]]
        }
        return shuffleArray;
    }

    async getVocabForExam(categoryId: number, userId: string, limit?: number, view?: string) {
        if (!userId) {
            throw new UnauthorizedException()
        }
        this.logger.log(`CategoryId [${categoryId}], ${typeof (categoryId)}`)
        this.logger.log(userId);
        let allVocabofCat: { vocabulary: { id: number, word: string, mean: string }[] } | null = { vocabulary: [] }

        if (view?.toString() !== 'favorite') {
            allVocabofCat = await this.prisma.category.findFirst({
                where: { id: categoryId, isDeleted: false, userId },
                select: {
                    vocabulary: {
                        select: {
                            id: true,
                            word: true,
                            mean: true
                        }
                    }
                }
            });
        } else if (view.toString() === 'favorite') {
            const result = await this.prisma.vocabulary.findMany({
                where: { isFavorite: true, category: { userId, isDeleted: false } }
            });
            allVocabofCat = {
                vocabulary: result
            }
        }

        if (!allVocabofCat || !allVocabofCat.vocabulary || allVocabofCat.vocabulary.length === 0) {
            return []
        }


        const questions = limit ? this.shuffleArray(allVocabofCat.vocabulary).slice(0, limit) : this.shuffleArray(allVocabofCat.vocabulary);
        let extraMeanQuestion: string[] = []
        if (questions.length < 4) {
            const extraVocab = await this.prisma.vocabulary.findMany({
                where: { categoryId: { not: categoryId } },
                select: { mean: true },
                take: 20
            });

            const extra = extraVocab.map((v) => v.mean);
            extraMeanQuestion = [...new Set(extra)];


        }

        return questions.map((q) => {
            let wrongAnswer = this.shuffleArray(allVocabofCat.vocabulary.filter((v) => v.id !== q.id && v.mean.trim().toLocaleLowerCase() !== q.mean.trim().toLocaleLowerCase()).map((v) => v.mean)).slice(0, 3);
            if (wrongAnswer.length < 3) {
                const extra = extraMeanQuestion.filter((m) => m.trim().toLocaleLowerCase() !== q.mean.trim().toLocaleLowerCase() && !wrongAnswer.some((w) => w.trim().toLocaleLowerCase() === m.trim().toLocaleLowerCase())).slice(0, 3 - wrongAnswer.length);
                wrongAnswer.push(...extra)
            }
            const options = this.shuffleArray([...wrongAnswer, q.mean])

            return {
                id: q.id,
                question: q.word,
                options,
                correctAnswer: q.mean

            }
        });




    }

    async fetchAllFavorites(userId: string) {
        if (!userId) {
            throw new UnauthorizedException('Không có userId');
        }
        const favorites = await this.prisma.vocabulary.findMany({
            where: {
                isFavorite: true,
                category: {
                    userId: userId,
                    isDeleted: false
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { vocabulary: favorites };
    }
}

