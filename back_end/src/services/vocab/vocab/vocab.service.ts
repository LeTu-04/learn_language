import { PrismaService } from '../../../Prisma/prisma.service';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BathUpdateFavoriteDto, CreateVocabularyDto, UpdateFavorite } from '../../../types/vocabularies';
import { Prisma } from '../../../../prisma/client/client';
import { not } from 'rxjs/internal/util/not';

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

    async getVocabForExam (categoryId : number, limit : number, userId : string) {
        if(!userId) {
            throw new UnauthorizedException()
        }
        this.logger.log(`CategoryId [${categoryId}], ${typeof(categoryId)}`)
        this.logger.log(userId);
        const allVocabofCat = await this.prisma.category.findFirst({
            where : {id : categoryId, isDeleted : false},
            select : {
                vocabulary : {select : {
                    id : true,
                    word : true,
                    mean : true
                } }
            }
        });
        if(!allVocabofCat) {
            throw new BadRequestException('Category Not Found')
        }
        if(!allVocabofCat?.vocabulary) {
            throw new BadRequestException('Không đủ để tạo thành bộ câu hỏi trắc nghiệm');
        }
        

        const storeRandom = allVocabofCat?.vocabulary.sort(() => Math.random() - 0.5) ;
        const question = storeRandom?.slice(0, limit);
        //Cần Promise.all() để đợi tất cả Promise hoàn thành rồi mới trả kết quả cuối cùng.
        return Promise.all(
            question?.map(async (q) => {
            const wrongAnswer = allVocabofCat?.vocabulary.filter((v) => v.id !== q.id)
            .sort(() => Math.random()-0.5)
            .slice(0,3)
            .map((v) => v.mean);
            if(wrongAnswer.length < 3) {
                const extraVocab = await this.prisma.vocabulary.findMany({
                    where : {categoryId : {not : categoryId}},
                    select : {mean : true},
                    take :  3 - wrongAnswer.length
                })
                wrongAnswer.push(...extraVocab.map((v) => v.mean));
            }
            const options = [...wrongAnswer, q.mean];

            return {
                id : q.id,
                question : q.word,
                options,
                correctAnswer : q.mean
            }
        })
        )


    }
}

