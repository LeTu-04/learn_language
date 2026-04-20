
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type {ConfigType}  from '@nestjs/config';
import {OAuth2Client} from 'google-auth-library'
import googleOauthConfig from '../../config/google-oauth.config';
import { PrismaService } from '../../../Prisma/prisma.service';
import { NameProvider } from '../../../../prisma/client/enums';
import { Token } from '../../token/token';



@Injectable()
export class GoogleService {
    private googleClient : OAuth2Client ;
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfig : ConfigType<typeof googleOauthConfig>,
        private readonly prisma : PrismaService,
        private token : Token
    ){
        this.googleClient = new OAuth2Client(
            googleConfig.clientID
        )
    }
    async loginWithgoogle(tokenId : string) {
       try {
         const ticket = await this.googleClient.verifyIdToken({
            idToken : tokenId,
            audience : this.googleConfig.clientID
        });
        const payload = ticket.getPayload();

        if(!payload?.email_verified) {
            throw new BadRequestException('Email user chưa được xác thực');
        }
        const googleId = payload.sub ;
        const existsUser = await this.prisma.provider.findUnique({
            where : {
                provider_providerId : {
                    provider : NameProvider.GOOGLE,
                    providerId : googleId
                },
                
            },include : {
                user : {
                    select : {
                        name : true ,
                        email : true,
                        id : true,
                        avatarUrl : true,
                        isActive : true
                    }
                }
            }
        });
        if(!existsUser) {
            const newUser =  await this.prisma.user.create({
                data : {
                    name : payload.name!,
                    email : payload.email,
                    avatarUrl : payload.picture!,
                    provider : {
                        create : {
                            provider : NameProvider.GOOGLE,
                            providerId : googleId
                        }
                    }
                }
            });

            const tokens = await this.token.issueToken(newUser.id);
            return {
                ...tokens,
                user : newUser
            }
        }else {
            if(!existsUser.user.isActive) {
                throw new BadRequestException('Rất tiếc tài khoản này đã bị vô hiệu hóa');
            }

            const tokens = await this.token.issueToken(existsUser.user.id);
            return {
                ...tokens,
                user : existsUser.user
            }
        }
        
        
       } catch (error) {
            throw error;
       }
    }
}
