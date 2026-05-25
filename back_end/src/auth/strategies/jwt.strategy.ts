import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';


interface payloadProps {
    sub : string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(jwtConfig.KEY)
        private jwt : ConfigType<typeof jwtConfig>
    ){
        super(
            {
                jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration : false,
                secretOrKey : jwt.jwt_access_secret
            }
        )
    }
    async validate(payload : payloadProps) {
        console.log('JWT_PAYLOAD_VALIDATE:', payload);
        return {
            ...payload,
            userId : payload.sub 
        } ;
    }
}