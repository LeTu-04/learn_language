import { PrismaService } from '../../../Prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from '../../../types/vocab';

@Injectable()
export class VocabService {
    constructor(private readonly prisma : PrismaService){}

    async create(data : CreateVocabularyDto) {
        try {
            const vocabulary = await this.prisma.vocabulary.create({
                data
            });
            return vocabulary;
        } catch (error) {
            if(error  instanceof Error) {
                console.log(error)
                throw new BadRequestException('Có lỗi xảy ra khi thêm từ vựng', error);
            }
        }
    }

    async getVocab () {
        const vocab = await this.prisma.vocabulary.findMany();
        console.log(vocab);
        return vocab;
    }
}
