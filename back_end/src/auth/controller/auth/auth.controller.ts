import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GoogleService } from '../../service/auth/google.service';
import type { Response } from 'express';
import type{ Request } from "express";

import { Public } from '../../decorators/jwt.public';
import { LocalService } from '../../service/auth/local/local.service';
import { JwtRefreshGuard } from '../../guards/jwt.refresh.guard';

import { JwtAuthGuard } from '../../guards/jwtaccess.guard';
import { JwtService } from '../../service/jwt/jwt.service';
import { ReGainPasswordDto, SendOtpDto, SignInDto, SignUpDto } from '../../service/auth/local/local.types';

@Controller('auth')
export class AuthController {
    constructor(private readonly google : GoogleService,
        private readonly local : LocalService,
        private readonly jwt : JwtService
    ){}

    @Public()
    @Post('google') 
    async loginGoole (
        @Body('tokenId') tokenId : string,
        @Res({ passthrough: true }) res: Response
    ) {
        const data = await this.google.loginWithgoogle(tokenId);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', data.refreshToken,({
            httpOnly : true,
            secure : isProd,
            sameSite  : isProd ? 'none' : 'lax',
            maxAge : 30 * 24 * 60 * 60 * 1000
        }));
        return {
            accessToken : data.accessToken,
            user : data.user
        }
        
    }

    @Public()
    @Post('sendotp')
    async checkAndSendOtp(
        @Body() data : SendOtpDto
    ) {
        const otp = await this.local.checkAndGenOtpForClient(data.email);
        return {
            message : 'SUCCESS',
            otp
        }
    }

    @Public()
    @Post('signup') 
    async SignUp (
        @Body() body : SignUpDto,
        @Res({passthrough : true})res : Response
    ){
        const data = await this.local.signUp(body);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', data.tokens.refreshToken, ({
            httpOnly : true, 
            secure : isProd,
            sameSite : isProd ? 'none' : 'lax',
            maxAge : 30 * 24 * 60 * 60 * 1000

        })) ;
        return {
            user : data.user,
            accessToken : data.tokens.accessToken
        }

        
    }
    @Public()
    @Post('signin')
    async signIn(
        @Body() body : SignInDto,
        @Res({passthrough : true}) res : Response
    ){
        const data = await this.local.SignIn(body);
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', data?.tokens.refreshToken, ({
            httpOnly : true,
            secure : isProd,
            sameSite : isProd ? 'none' : 'lax',
            maxAge : 30 * 24 * 60 * 60 * 1000
        }))    
        return {
            user : data?.user,
            accessToken : data?.tokens.accessToken
        }
    }

    @UseGuards(JwtRefreshGuard)
    @Post('logout')
    async logOut (
        @Res({passthrough : true})res : Response,
        @Req()req : Request
    ) {
        if(!req.user) {
            throw new UnauthorizedException()
        }
        await this.local.logOut(req.user?.sub, req.user?.jti);
        res.clearCookie('refreshToken');
        return {
            message : 'Đăng xuất thành công'
        }
    }


    @Public()
    @UseGuards( JwtRefreshGuard)
    @Get('refresh')
    async refresh (
        @Res({passthrough : true}) res : Response,
        @Req()req : Request
    ) {
        const data = await this.jwt.refreshToken(req.cookies.refreshToken);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly : true,
            secure : isProd,
            sameSite : isProd ? 'none' : 'lax',
            maxAge : 30 * 24 * 60 * 60 * 1000
        })
        return {
            newAccessToken : data.accessToken,
            user : data.user
        }
    }


    @Public()
    @Post('forgot-password-otp')
    async sendOtpInCaseForgotPass(
        @Body () body : SendOtpDto
    ) {
        await this.local.sendOtpForReGainPass(body.email);
        return {
            message : 'SUCCESS'
        }
    }

    @Public()
    @Post('forgot-password') 
    async forgotPassword (
        @Body() body : ReGainPasswordDto
    ) {
        await this.local.reGainPassword(body);
        return {
            message : 'SUCCESS'
        }
    }
    
    

    
}
