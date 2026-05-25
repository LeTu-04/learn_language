import { Body, Controller, Get, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import {type  CreatePostDto, DiscussService } from '../../services/discuss/discuss.service';
import type { Request } from 'express';
import { error } from 'console';

@Controller('discuss')
export class DiscussController {
    constructor(private readonly discuss : DiscussService){}
    
    @Post()
    async create (
        @Body() dto : CreatePostDto,
        @Req ()req : Request
    ) {
        const userId = req.user?.sub;
        if(!userId) {
            console.log('userId undefined')
            throw error;
        }
        const data = await this.discuss.createPost(dto,userId)
        return {
            message : 'SUCCESS',
            data
        }
    }

    @Get()
    async fetch(
        @Query('cursor', new ParseIntPipe({optional : true})) cursor? : number
    ) {
        const {postData, cursor : nextcursor} =  await this.discuss.fetchAllPost(cursor);
        return {
            message : 'SUCCESS',
            postData,
            nextcursor
        }
    }
}
