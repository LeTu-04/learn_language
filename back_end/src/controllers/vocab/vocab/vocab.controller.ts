import { Result } from './../../../../prisma/client/internal/prismaNamespace';

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { STATUS_CODES } from 'http';

import { VocabService } from '../../../services/vocab/vocab/vocab.service.js';
import { CreateVocabularyDto } from '../../../types/vocabularies';

@Controller('Category')
export class VocabController {
    constructor(readonly vocab : VocabService){}
    @Post(':CategoryId/vocabularies')
    async create(
        @Body() data : CreateVocabularyDto,
        @Param('CategoryId', ParseIntPipe) CategoryId : number
    ) {
        await this.vocab.create(CategoryId,data);
        return {
            message : 'Tạo dữ liệu thành công',
            data : data,
            STATUS_CODES : 201 
        }
    }
    @Get(':CategoryId/vocabularies')
    async getVocab() {
        const vocab = await this.vocab.fetch();
        return {
            message : 'Lấy dữ liệu thành công',
            data : vocab,
            STATUS_CODES : 200
        }
    }
}
