import { Result } from './../../../../prisma/client/internal/prismaNamespace';

import { Body, Controller, Get, Post } from '@nestjs/common';

import { STATUS_CODES } from 'http';
import * as vocab from '../../../types/vocab.js';
import { VocabService } from '../../../services/vocab/vocab/vocab.service.js';

@Controller('vocab')
export class VocabController {
    constructor(readonly vocab : VocabService){}
    @Post()
    async create(
        @Body() data : vocab.Vocabulary[]
    ) {
        await this.vocab.create(data);
        return {
            message : 'Tạo dữ liệu thành công',
            data : data,
            STATUS_CODES : 201 
        }
    }
    @Get()
    async getVocab() {
        const vocab = await this.vocab.getVocab();
        return {
            message : 'Lấy dữ liệu thành công',
            data : vocab,
            STATUS_CODES : 200
        }
    }
}
