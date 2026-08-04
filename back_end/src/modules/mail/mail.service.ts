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
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.mailCfg.mail_user,
                pass: this.mailCfg.mail_pass,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });
    }

    async sendOtp(toEmail: string, otp: string) {
        const mailsOption = {
            from: `"Learning Language" <${this.mailCfg.mail_user}>`,
            to: toEmail,
            subject: 'Mã xác thực OTP của bạn',
            text: `Mã OTP của bạn là : ${otp}. Mã này sẽ hết hạn sau 3 phút`,
            html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}</b></h3><p>Mã này sẽ hết hạn trong 3 phút.</p>`,
        };
        await this.transporter.sendMail(mailsOption);
    }
}

