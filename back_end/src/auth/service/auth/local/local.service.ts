import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../Prisma/prisma.service';
import * as argon2 from 'argon2'
import { Token } from '../../../token/token';
import { GenerateHashService } from '../../../../utils/hash.utils';
import { RedisService } from '../../../../modules/redis/redis.service';
import { MailService } from '../../../../modules/mail/mail.service';
import { ReGainPasswordDto, SignInDto, SignUpDto } from './local.types';
import { ResendService } from '../../../../modules/resend/resend.service';

@Injectable()
export class LocalService {
    constructor(
        private prisma : PrismaService,
        private token : Token,
        private readonly hash : GenerateHashService,
        private readonly redis : RedisService,
        private readonly mail : ResendService
    ){}

        // async testScale () {
        //     const password  = 'nguyenletu';
        //     const start = Date.now();
        //     await argon2.hash(password);
        //     const end = Date.now();

        //     return end-start;
        // }
    



    async checkAndGenOtpForClient (email : string) : Promise<void>{
        const isExists = await this.prisma.user.findUnique({
            where : {email }
        });
        if(isExists) {
            throw new BadRequestException('Email đã tồn tại');
        }
        const otp = this.hash.generateOtp();
        await this.redis.setEmailOtp(email, otp);
        this.mail.sendOtp(email, otp).catch(err => console.error('Error sending OTP mail:', err));

    }
    

    async signUp (data : SignUpDto){
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
        
        const otpValueInRedis = await this.redis.getEmailOpt(data.email);

        const otpExact = this.hash.createHmacForOtpValue(data.email, data.inputotp) === otpValueInRedis ;

        if(!otpExact) {
            throw new BadRequestException('Sai mã xác thực OTP')
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

    async SignIn(data : SignInDto) {
        const isExists = await this.prisma.user.findUnique({
            where : {email : data.email}, select : {email : true, password : true, id : true, name : true, avatarUrl : true,
                totalVocabLearn : true,
                currentStreak : true,
                longestStreak : true
            }
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


    async sendOtpForReGainPass (email : string) {
        if(!email) {
            throw new BadRequestException('Không có email');
        }
        const emailExists = await this.prisma.user.findUnique({
            where : {email}
        });

        if(!emailExists) {
            throw new UnauthorizedException('Thông tin không hợp lệ');
        }

        const otp = this.hash.generateOtp();
        this.mail.sendOtp(email, otp);

        await this.redis.setEmailOtp(email, otp); 

    }

    async reGainPassword ({email, otp, newPassword} : ReGainPasswordDto) {
        const emailExists = await this.prisma.user.findUnique({

            where : {email}
        })
        if(!emailExists) {throw new NotFoundException('Thông tin không hợp lệ')}
        const otpFromClient = await this.hash.createHmacForOtpValue(email, otp);
        const otpAlreadyExists = await this.redis.getEmailOpt(email);
        if(otpFromClient !== otpAlreadyExists) {
            throw new BadRequestException('Sai mã OTP');
        }

        const newPasswordHashed = await argon2.hash(newPassword);
        await this.prisma.user.update({
            where : {email},
            data : {
                password : newPasswordHashed
            }
        });

        await this.redis.deleteOtp(email)
    }
}
