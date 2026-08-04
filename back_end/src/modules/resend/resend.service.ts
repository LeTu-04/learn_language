import { Injectable, OnModuleInit } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()

export class ResendService implements OnModuleInit {
    private resend: Resend;
    onModuleInit() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendOtp(toEmail: string, otp: string) {
        try {
            const data = await this.resend.emails.send({
                from: 'Learning Language <onboarding@resend.dev>',
                to: toEmail,
                subject: 'Mã xác thực OTP của bạn',
                html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}
                </b></h3><p>Mã này sẽ hết hạn trong 3 phút.</p>`,
            });

            console.log('Resend mail Success');
            return data;
        } catch (error) {
            console.log('Resend mail Error', error)
        }
    }
}

