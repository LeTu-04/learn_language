import { PrismaService } from '../../../Prisma/prisma.service';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BathUpdateFavoriteDto, CreateVocabularyDto, UpdateFavorite } from '../../../types/vocabularies';
import { Prisma } from '../../../../prisma/client/client';

@Injectable()
export class VocabService {
    
    private readonly logger = new Logger(VocabService.name);
    constructor(private readonly prisma : PrismaService){}

    async create(categoryId : number, data : CreateVocabularyDto, userId : string) {
        if(!userId) {
            throw new UnauthorizedException('Không có userId');
        }
        if(!categoryId) {
            throw new BadRequestException('Không thể thêm dữ liệu khi không có categoryId');
        }
        const CategoryExists = await this.prisma.category.findFirst({
            where : {id : categoryId, userId}
        });
        if(!CategoryExists) {
            throw new NotFoundException('Không tìm thấy Category')
        }

        const vocabularyData = {...data, categoryId}
        try {
            const [vocabulary, countVocabulary] = await this.prisma.$transaction([
                this.prisma.vocabulary.create({
                    data : vocabularyData
                }),
                this.prisma.vocabulary.count({
                    where : {
                        categoryId : categoryId
                    }
                })
            ])
            this.logger.log(vocabulary);
            this.logger.log(countVocabulary);
            return {
                vocabulary,
                countVocabulary
            } ;
            
        }catch (error) {
            if(error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Dữ liệu không hợp lệ')
            }

            this.logger.error(`Có lỗi xảy ra khi thêm từ vựng ${error}`);
            throw new Error('Không thể thêm từ vựng');
        }
    }
    async fetch(categoryId : number, userId : string) {
        const isExists = await this.prisma.category.findFirst({
            where : {id : categoryId, userId}
        });
        if (!isExists) {
            throw new NotFoundException('Không tìm thấy folder cho tệp này');
        }
        const vocabularies = await this.prisma.category.findFirst({
            where : {id : categoryId, userId},
            select : {
                vocabulary : true
            }
        });
        return vocabularies
    }
    
    async delete (categoryId : number, vocabularyId : number, userId : string) {
                
        const [isCategoryExists, isVocabularyExists] = await this.prisma.$transaction([
            this.prisma.category.findFirst({
                where : {id : categoryId, isDeleted : false, userId}
            }),
            this.prisma.vocabulary.findFirst({
                where : {id : vocabularyId, categoryId}
            })
        ])
        
        try {
            if(!isCategoryExists || !isVocabularyExists) {
                throw new NotFoundException('Không tìm thấy dữ liệu');
        }
        await this.prisma.vocabulary.delete({
            where : {id : vocabularyId, categoryId : categoryId}
        });
            
        } catch (error) {
            throw new Error('Có lỗi, không xóa được')
        }
    }

    async updateFavoriteVocab(data : BathUpdateFavoriteDto) {
        await this.prisma.$transaction(
            data.changes.map((item) => 
                this.prisma.vocabulary.update(
                    {
                        where : {id : item.id},
                        data : {isFavorite : item.isFavorite}
                    }
                )
            )
        )
    }

    // async updateFavoriteWithBeacon (data : BathUpdateFavoriteDto) {
    //     await this.prisma.$transaction(
    //         data.changes.map((item) => 
    //             this.prisma.vocabulary.update({
    //                 where : {id : item.id},
    //                 data : {isFavorite : item.isFavorite}
    //             })
    //         )
    //     )
    // }
}
