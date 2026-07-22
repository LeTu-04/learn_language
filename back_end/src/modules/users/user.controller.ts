import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import type { Request } from "express";
import { ChangeNameUserDto, ChangePasswordDto } from "./user.dto";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('user')

export class UserController {
    constructor(
        private readonly user: UserService
    ) { }

    @Get('profile')
    async getDetailUser(
        @Req() req: Request
    ) {
        const userId = req.user?.sub;
        const data = await this.user.getDetailUser(userId!);
        return {
            message: 'SUCCESS',
            data
        }
    }

    @Patch('change-name')
    async changeName(
        @Body() dto: ChangeNameUserDto,
        @Req() req: Request
    ) {
        const data = await this.user.UpdateNameProfile(req.user?.sub!, dto.newName);
        return {
            message: 'SUCCESS',
            data
        }
    }
    @Patch('change-pass')
    async changePassword(
        @Body() dto: ChangePasswordDto,
        @Req() req: Request
    ) {
        const data = await this.user.changePassword(dto.oldPass, dto.newPass, req.user?.sub!);
        return {
            message: 'SUCCESS',
            data
        }
    }

    @Patch('change_avatar')
    @UseInterceptors(FileInterceptor('file'))
    async changeAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        const data = await this.user.changeAvatar(file, req.user?.sub!);
        return {
            message: 'Thay ảnh đại diện thành công',
            data
        }
    }

    @Get('mypost')
    async getPost(
        @Req() req: Request
    ) {
        const data = await this.user.getALlPostOfUser(req.user?.sub!);
        return {
            message: 'SUCCESS',
            postData: data
        }
    }

    @Post('like/:postId')
    async likePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request
    ) {
        if (!req.user?.sub) {
            throw new UnauthorizedException();
        }
        const data = await this.user.likePost(postId, req.user.sub);
        return {
            message: 'SUCCESS',
            data
        }
    }

    @Post('comment/:postId')
    async createComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body('content') content: string,
        @Req() req: Request
    ) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new UnauthorizedException();
        }
        if (!content || !content.trim()) {
            throw new BadRequestException('Nội dung bình luận không được để trống');
        }
        const data = await this.user.createComment(postId, userId, content);
        return {
            message: 'SUCCESS',
            data
        }
    }

    @Get('comment/:postId')
    async getComment(
        @Param('postId', ParseIntPipe) postId: number
    ) {
        const data = await this.user.getComment(postId);
        return {
            message: 'SUCCESS',
            data
        }
    }

    @Get('mypost/comment/:postId')
    async getCommentOfMyPost(
        @Param('postId', ParseIntPipe) postId: number
    ) {
        const data = await this.user.getCommentMyPost(postId);
        return {
            message: 'SUCCESS',
            data
        }
    }
}

