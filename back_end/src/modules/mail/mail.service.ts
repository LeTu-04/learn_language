import { Inject, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import mailConfig from "../../auth/config/mail.config";
import type { ConfigType } from "@nestjs/config";

import * as nodemailer from 'nodemailer';

export class MailService implements OnModuleInit {
    private transporter;
    constructor(
        private readonly redis: RedisService,
        @Inject(mailConfig.KEY)
        private mailCfg: ConfigType<typeof mailConfig>
    ) { }

    onModuleInit() {
        const mailUser = this.mailCfg?.mail_user || process.env.MAIL_USER || 'ntu81778@gmail.com';
        const mailPass = this.mailCfg?.mail_pass || process.env.MAIL_PASS || 'aoavqxkstvsveawn';
        console.log('INIT MAIL SERVICE USER:', mailUser);

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailUser,
                pass: mailPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendOtp(toEmail: string, otp: string) {
        try {
            const mailUser = this.mailCfg?.mail_user || process.env.MAIL_USER || 'ntu81778@gmail.com';
            const mailsOption = {
                from: `"Learning Language" <${mailUser}>`,
                to: toEmail,
                subject: 'Mã xác thực OTP của bạn',
                text: `Mã OTP của bạn là : ${otp}. Mã này sẽ hết hạn sau 3 phút`,
                html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}</b></h3><p>Mã này sẽ hết hạn trong 3 phút.</p>`,
            };
            const result = await this.transporter.sendMail(mailsOption);
            console.log('SEND MAIL SUCCESS TO', toEmail, 'ID:', result.messageId);
            return result;
        } catch (error) {
            console.error('SEND MAIL FAILED ERROR FOR', toEmail, ':', error);
        }
    }
}

