import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import jwtConfig from '../config/jwt.config';
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import * as argon2 from 'argon2'
import { PrismaService } from "../../Prisma/prisma.service";
import ms from "ms";

@Injectable()
export class Token {
    constructor(
        @Inject(jwtConfig.KEY)
        private jwtConfiguration : ConfigType<typeof jwtConfig>,
        private jwt : JwtService,
        private prisma : PrismaService
    ) {

    }
    async issueToken (userId : string) {
        const payload = {
            sub : userId
        }

        const jti = uuidv4()
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync({
                ...payload,
                type : 'access'
            }, {
                secret : this.jwtConfiguration.jwt_access_secret,
                expiresIn : this.jwtConfiguration.jwt_access_expire 
            }),
            this.jwt.signAsync({
                ...payload,
                type : 'refresh',
                jti
            }, {
                secret : this.jwtConfiguration.jwt_refresh_secret,
                expiresIn : this.jwtConfiguration.jwt_refresh_expire 
            })
        ]);

        const refreshTokenEncode = await argon2.hash(refreshToken);
        const expiresIn = this.jwtConfiguration.jwt_refresh_expire ;
        const expiresAt = new Date(Date.now() + expiresIn)
        await this.prisma.refreshToken.create({
            data : {
                jti : jti,
                refreshToken : refreshTokenEncode,
                userId : userId,
                expireAt : expiresAt
            }
        });

        return {
            accessToken,
            refreshToken
        }
    }

}

