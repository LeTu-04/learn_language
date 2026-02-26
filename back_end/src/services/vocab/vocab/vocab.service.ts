import { PrismaService } from '../../../Prisma/prisma.service';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVocabularyDto } from '../../../types/vocabularies';
import { Prisma } from '../../../../prisma/client/client';

@Injectable()
export class VocabService {
    
    private readonly logger = new Logger(VocabService.name);
    constructor(private readonly prisma : PrismaService){}

    async create(categoryId : number, data : CreateVocabularyDto) {
        if(!categoryId) {
            throw new BadRequestException('Không thể thêm dữ liệu khi không có categoryId');
        }
        const CategoryExists = await this.prisma.category.findFirst({
            where : {id : categoryId}
        });
        if(!CategoryExists) {
            throw new NotFoundException('Không tìm thấy Category')
        }

        const vocabularyData = {...data, categoryId}
        try {
            const vocabulary = await this.prisma.vocabulary.create({
                data : vocabularyData
            });
            this.logger.log(vocabulary);
            return vocabulary ;
            
        }catch (error) {
            if(error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Dữ liệu không hợp lệ')
            }

            this.logger.error(`Có lỗi xảy ra khi thêm từ vựng ${error}`);
            throw new Error('Không thể thêm từ vựng');
        }
    }
    async fetch() {

    }
    
}
