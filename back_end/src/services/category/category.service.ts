import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { CreateCategoryDto, updateCategory } from '../../types/categories';


@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }




    async createCategory(data: CreateCategoryDto, userId: string) {
        if (!userId) {
            throw new BadRequestException('USER_ID_MISSING');
        }
        const category = await this.prisma.category.create({
            data: {
                name: data.name,
                userId: userId
            }
        })
        return category;
    }

    async fetchCategory(userId: string) {
        const data = await this.prisma.category.findMany({
            where: {
                isDeleted: false, userId: userId
            }, orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(data);
        return data;
    }

    async softRemoveCategory(id: number, userId: string) {
        await this.prisma.$transaction(async (tx) => {
            const totalVocabNeedtoRemove = await tx.vocabulary.count({
                where: { categoryId: id }
            });

            await tx.category.update({
                where: { id, userId: userId },
                data: {
                    isDeleted: true,
                    deletedAt: new Date()
                }
            });

            if (totalVocabNeedtoRemove > 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        totalVocabLearn: {
                            decrement: totalVocabNeedtoRemove
                        }
                    }
                });
            }
        });
    }

    async updateCategory(id: number, data: updateCategory, userId: string) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
        });
        if (!category) {
            throw new BadRequestException('Không tìm thấy Category');
        }
        if (category.name === data.name) {
            return category;
        }
        return await this.prisma.category.update({
            where: { id, userId },
            data: { name: data.name }
        });

    }

    async getAllCategoryRemoved(userId: string) {
        try {
            const categoryRemoved = await this.prisma.category.findMany({
                where: {  userId, isDeleted: true },
            });
            return categoryRemoved.map(({ userId: __, ...categoryData }) => categoryData);
        } catch (error) {
            throw error;
        }
    }

    async deletedCategoryInTrash(categoryId: number, userId: string) {
        try {
            await this.prisma.category.delete({
                where: { id: categoryId, isDeleted: true, userId },
            });
        } catch (error) {
            throw error;
        }
    }

    async reStoreCategoryRemoved(categoryId: number, userId: string) {
        try {
            await this.prisma.category.update({
                where: { userId, id: categoryId, isDeleted: true },
                data: { isDeleted: false }
            });
        } catch (error) {
            throw error;
        }
    };
    
    async getDetailCategoryRemoved (categoryId : number, userId : string) {
        try {
            const vocabularyDataDeledted = await this.prisma.category.findUnique(
            {
                where : {id : categoryId, userId},
                select : {
                    id : true,
                    name : true,
                    deletedAt : true,
                    vocabulary : {
                        select : {
                            word : true,
                            mean : true,
                            example : true
                        }
                    }
                }
            },
        )
        return vocabularyDataDeledted;
        } catch (error) {
            throw error;
        }
            
        }
    }

