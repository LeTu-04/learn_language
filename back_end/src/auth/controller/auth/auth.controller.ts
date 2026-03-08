import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from '../../service/auth/google.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwtaccess.guard';
import { Public } from '../../decorators/jwt.public';

@Controller('auth')
export class AuthController {
    constructor(private readonly google : GoogleService){}
    @Public()
    @Post('google') 
    async loginGoole (
        @Body('tokenId') tokenId : string,
        @Res({ passthrough: true }) res: Response
    ) {
        const data = await this.google.loginWithgoogle(tokenId);
        res.cookie('refreshToken', data.refreshToken,({
            httpOnly : true,
            secure : false, // true nếu https
            sameSite  : 'lax',
            maxAge : 30 * 24 * 60 * 60 * 1000
        }));
        return {
            accessToken : data.accessToken,
            user : data.user
        }
        
    }
}
