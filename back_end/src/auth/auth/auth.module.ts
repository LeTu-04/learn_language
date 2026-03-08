import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '../config/google-oauth.config';
import { GoogleService } from '../service/auth/google.service';
import { JwtModule } from "@nestjs/jwt";
import { Token } from '../token/token';
import jwtConfig from '../config/jwt.config';
import { AuthController } from '../controller/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
    imports : [
        PassportModule,
        ConfigModule.forFeature(googleOauthConfig),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.register({})
    ],
    controllers : [AuthController],
    providers : [GoogleService, Token, JwtStrategy],
    exports : [GoogleService]
})
export class AuthModule {}
