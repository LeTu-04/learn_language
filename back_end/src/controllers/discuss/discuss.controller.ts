import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreatePostDto, DiscussService } from '../../services/discuss/discuss.service';
import type { Request } from 'express';
import { error } from 'console';

import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('discuss')
export class DiscussController {
    constructor(private readonly discuss : DiscussService){}
    
    @Post()
    @UseInterceptors(
         FileInterceptor('file', {
            storage : memoryStorage(),
            limits :{
                fileSize : 5 * 1024 * 1024,
            }
        })
    )
    async create (
        @Body() dto : CreatePostDto,
        @Req ()req : Request,
        @UploadedFile()file? : Express.Multer.File
    ): Promise<{ message: string; data: CreatePostDto; }> {
        const userId = req.user?.sub;
        if(!userId) {
            console.log('userId undefined')
            throw error;
        }
        if(file) {
            dto.file = file
        }
        const data = await this.discuss.createPost(dto,userId)
        return {
            message : 'SUCCESS',
            data
        }
    }

    @Get()
    async fetch(
        @Query('cursor', new ParseIntPipe({optional : true})) cursor? : number,
        @Req() req? : Request
    ) {
       const userId = req?.user?.sub; 
        const {postData, cursor : nextcursor} =  await this.discuss.fetchAllPost(cursor,10,userId);
        return {
            message : 'SUCCESS',
            postData,
            nextcursor
        }
    }
}
