
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request} from "express";

import { VocabService } from '../../../services/vocab/vocab/vocab.service.js';
import { BathUpdateFavoriteDto, CreateVocabularyDto } from '../../../types/vocabularies';



@Controller('Category')
export class VocabController {
    constructor(readonly vocab : VocabService){}
    @Post(':CategoryId/vocabularies')
    async create(
        @Body() data : CreateVocabularyDto,
        @Req()req : Request,
        @Param('CategoryId', ParseIntPipe) CategoryId : number
    ) {
        if(!req.user?.sub) {
            throw new UnauthorizedException('Không có user-id');
        }
        const result = await this.vocab.create(CategoryId,data, req.user.sub);
        return {
            message : 'Tạo dữ liệu thành công',
            data : result,
            STATUS_CODES : 201 
        }
    }
    @Get(':CategoryId/vocabularies')
    async getVocab(
        @Param('CategoryId', ParseIntPipe) categoryId : number,
        @Req()req : Request
    ) {
        if(!req.user?.sub){
            throw new UnauthorizedException()
        }
        const vocab = await this.vocab.fetch(categoryId, req.user.sub);
        return {
            message : 'Lấy dữ liệu thành công',
            data : vocab,
            STATUS_CODES : 200
        }
    }
    
    @Delete(':CategoryId/vocabularies/:vocabularyId')
    async delete (
        @Param('CategoryId', ParseIntPipe) CategoryId : number,
        @Param('vocabularyId', ParseIntPipe) vocabularyId : number,
        @Req()req : Request
    ) {
        if(!req.user?.sub) 
            throw new UnauthorizedException();
        await this.vocab.delete(CategoryId, vocabularyId, req.user?.sub);
        return {
            message : "Xóa từ vựng thành công",
            STATUS_CODES : 204
        }
    }

    @Patch('vocabularies/favorite')
    async updateFavorite (
        @Body() body : BathUpdateFavoriteDto
    ){
        return await this.vocab.updateFavoriteVocab(body);
    }

    // @Post('vocabularies/favorite-beacon')
    // async updateFavoriteBeacon (
    //     @Body() body : BathUpdateFavoriteDto
    // ) {
    //     return await this.vocab.updateFavoriteWithBeacon(body);
    // }

    @Get(':CategoryId/exam')
    async exam(
        @Param('CategoryId', ParseIntPipe) CategoryId : number,
        @Query('limit') limit : number ,
        @Req()req : Request
    ) {
        return this.vocab.getVocabForExam(CategoryId, limit, req.user?.sub!);
    }
}
