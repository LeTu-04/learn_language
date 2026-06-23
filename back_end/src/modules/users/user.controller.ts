import { Body, Controller, Get, Patch, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import type { Request } from "express";
import { ChangeNameUserDto, ChangePasswordDto } from "./user.dto";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('user')

export class UserController {
    constructor(
        private readonly user : UserService
    ){}

    @Get('profile')
    async getDetailUser (
        @Req()req : Request
    ) {
        const userId = req.user?.sub ;
        const data = await this.user.getDetailUser(userId!);
        return {
            message : 'SUCCESS',
            data
        }
    }

    @Patch('change-name')
    async changeName (
        @Body() dto : ChangeNameUserDto,
        @Req () req : Request
    ) {
        const data = await this.user.UpdateNameProfile(req.user?.sub!, dto.newName);
        return {
            message : 'SUCCESS',
            data
        }
    }
    @Patch('change-pass')
    async changePassword (
        @Body() dto : ChangePasswordDto,
        @Req () req : Request
    ) {
        const data = await this.user.changePassword(dto.oldPass,dto.newPass,req.user?.sub!);
        return {
            message : 'SUCCESS',
            data
        }
    }

    @Patch('change_avatar')
    @UseInterceptors(FileInterceptor('file'))
    async changeAvatar (
        @UploadedFile() file : Express.Multer.File,
        @Req()req : Request
    ) {
        const data = await this.user.changeAvatar(file, req.user?.sub!);
        return {
            message : 'Thay ảnh đại diện thành công',
            data
        }
    }

    @Get('mypost')
    async getPost (
        @Req() req : Request
    ) {
        const data = await this.user.getALlPostOfUser(req.user?.sub!);
        return {
            message : 'SUCCESS',
            postData : data
        }
    }
}

