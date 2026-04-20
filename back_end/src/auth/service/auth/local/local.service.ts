import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../Prisma/prisma.service';
import { SignIn_Up } from './local.types';
import * as argon2 from 'argon2'
import { Token } from '../../../token/token';

@Injectable()
export class LocalService {
    constructor(private prisma : PrismaService,
        private token : Token
    ){}
    async signUp (data : SignIn_Up){
        if(!data) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng')
        }

        const cleanEmail = data.email.trim().toLocaleLowerCase()
    
        const isExists = await this.prisma.user.findUnique({
            where : {email : cleanEmail}
        });
        if(isExists) {
            throw new BadRequestException('Email này đã được sử dụng, vui lòng thay đổi');
        }
        
        const passwordHash = await argon2.hash(data.password);

        const {user, tokens} = await this.prisma.$transaction(
            async(tx) => {
                const user = await tx.user.create({
                    data : {
                        email : cleanEmail,
                        password : passwordHash,
                    },select : {
                        id : true,
                        email : true,
                        avatarUrl : true,
                        name : true
                    }
                });
                const tokens = await this.token.issueToken(user.id, tx);

                return {
                    user,
                    tokens
                }
            }
        )
        
 
        return {
            user : user,
            tokens : tokens
        }

    }

    async SignIn(data : SignIn_Up) {
        const isExists = await this.prisma.user.findUnique({
            where : {email : data.email}, select : {email : true, password : true, id : true, name : true, avatarUrl : true}
        });
        if(!isExists) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
        }

        const valueToCheck = isExists.password 
        if(!valueToCheck) return;

        const isMatch = await argon2.verify(valueToCheck, data.password) ;
        if(!isMatch) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
        }

        const tokens = await this.token.issueToken(isExists.id);

        const {password, ...choose} = isExists;

        return {
            user : choose,
            tokens : tokens
        }
    }

    async logOut (userId: string, jti : string) {
        try {
            const token = await this.prisma.refreshToken.findUnique({
                where : {jti : jti} 
            });
            if(!token || token.userId !== userId || token.revoked === true) {
                throw new UnauthorizedException('Token không hợp lệ');
            }
            await this.prisma.refreshToken.update ({
                where : {
                    jti : jti,
                    revoked : false
                },
                data : {
                    revoked : true
                }
            })
        } catch (error) {
            throw error
        }

    }
}
