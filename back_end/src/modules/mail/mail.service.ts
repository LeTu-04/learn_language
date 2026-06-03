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
            service: 'gmail',
            auth: {
                user: this.mailCfg.mail_user,
                pass: this.mailCfg.mail_pass,
            }
        });
    }

    async sendOtp(toEmail: string, otp: string) {
        const mailsOption = {
            from: `"Learning Language" <${this.mailCfg.mail_user}>`,
            to: toEmail,
            subject: 'Mã xác thực OTP của bạn',
            text: `Mã OTP của bạn là : ${otp}. Mã này sẽ hết hạn sau 2 phút`,
            html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}</b></h3><p>Mã này sẽ hết hạn trong 5 phút.</p>`,
        };
        await this.transporter.sendMail(mailsOption);
    }
}

