import { Result } from './../../../../prisma/client/internal/prismaNamespace';

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

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
        const result = await this.vocab.create(CategoryId,data);
        return {
            message : 'Tạo dữ liệu thành công',
            data : result,
            STATUS_CODES : 201 
        }
    }
    @Get(':CategoryId/vocabularies')
    async getVocab(
        @Param('CategoryId', ParseIntPipe) categoryId : number
    ) {
        const vocab = await this.vocab.fetch(categoryId);
        return {
            message : 'Lấy dữ liệu thành công',
            data : vocab,
            STATUS_CODES : 200
        }
    }
    
    @Delete(':CategoryId/vocabularies/:vocabularyId')
    async delete (
        @Param('CategoryId', ParseIntPipe) CategoryId : number,
        @Param('vocabularyId', ParseIntPipe) vocabularyId : number
    ) {
        await this.vocab.delete(CategoryId, vocabularyId);
        return {
            message : "Xóa từ vựng thành công",
            STATUS_CODES : 204
        }
    }
}
