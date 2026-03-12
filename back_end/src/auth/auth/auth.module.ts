import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '../config/google-oauth.config';
import { GoogleService } from '../service/auth/google.service';
import { JwtModule} from "@nestjs/jwt";
import { Token } from '../token/token';
import jwtConfig from '../config/jwt.config';
import { AuthController } from '../controller/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalService } from '../service/auth/local/local.service';
import { JwtService } from '../service/jwt/jwt.service';
import { JwtRefreshStrategy } from '../strategies/jwt.refresh.strategy';

@Module({
    imports : [
        PassportModule,
        ConfigModule.forFeature(googleOauthConfig),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.register({})
    ],
    controllers : [AuthController],
    providers : [GoogleService, Token, JwtStrategy, JwtService, LocalService, JwtRefreshStrategy],
    exports : [GoogleService, JwtService, LocalService]
})
export class AuthModule {}
