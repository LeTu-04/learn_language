
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { Request } from "express";


interface payloadProps {
    id : string,
    jti : string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy (Strategy, 'jwt-refresh') 
{
    constructor(
        @Inject(jwtConfig.KEY)
        private jwt : ConfigType<typeof jwtConfig>
    ){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (req : Request) => req.cookies.refreshToken
            ]),
            ignoreExpiration : false,
            secretOrKey : jwt.jwt_refresh_secret
            
        })
    }
    validate(payload  : payloadProps) {
        return {
            ...payload,
            sub : payload.id
        }
    }
}