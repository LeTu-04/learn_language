import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { PrismaService } from '../../../Prisma/prisma.service';
import * as argon2 from "argon2";
import { Token } from '../../token/token';


interface payloadProps {
    sub : string
    jti : string
}

@Injectable()
export class JwtService {
    constructor (
        @Inject(jwtConfig.KEY)
        private jwtConfiguration : ConfigType <typeof jwtConfig>,
        private jwt : NestJwtService,
        private prisma : PrismaService,
        private token : Token
    ) {
 
    }
    async refreshToken (refreshOld : string){
        let payload :  payloadProps;
        try {
            payload = await this.jwt.verifyAsync(refreshOld, {
                secret : this.jwtConfiguration.jwt_refresh_secret
            })
        }catch (error) {
            throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
        }

        const storedToken = await this.prisma.refreshToken.findUnique({
            where : {
                jti : payload.jti
            }
        })
        if(!storedToken || storedToken.revoked) {
           if(storedToken) {
             await this.prisma.refreshToken.updateMany({
                where : {userId : payload.sub},
                data : {revoked : true}
            })
           }
            throw new UnauthorizedException('Token đã bị thu hồi');
            
        }

        const isValid = await argon2.verify(storedToken.refreshToken, refreshOld);
        if (!isValid) {
            
            await this.prisma.refreshToken.updateMany({
                where : {userId : payload.sub, revoked : false},
                data : {revoked : true}
            })
            throw new UnauthorizedException('Token không khớp');
        }
    
        await this.prisma.refreshToken.update({
            where : {jti : payload.jti},
            data : {revoked : true}
        });

        return this.token.issueToken(payload.sub);
    }

}
