import { Injectable, OnModuleInit } from "@nestjs/common";



@Injectable()

export class ResendService {
    // private resend: Resend;
    // onModuleInit() {
    //     this.resend = new Resend(process.env.RESEND_API_KEY);
    // }

    // async sendOtp(toEmail: string, otp: string) {
    //     try {
    //         const data = await this.resend.emails.send({
    //             from: 'Learning Language <onboarding@resend.dev>',
    //             to: toEmail,
    //             subject: 'Mã xác thực OTP của bạn',
    //             html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}
    //             </b></h3><p>Mã này sẽ hết hạn trong 3 phút.</p>`,
    //         });

    //         console.log('Resend mail Success');
    //         return data;
    //     } catch (error) {
    //         console.log('Resend mail Error', error)
    //     }
    // }

    async sendOtp(toEmail: string, otp: string) {
        try {
            const serviceId = process.env.EMAILJS_SERVICE_ID;
            const templateId = process.env.EMAILJS_TEMPLATE_ID;
            const publicKey = process.env.EMAILJS_PUBLIC_KEY;

            const response = await fetch(
                'https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                        email: toEmail,
                        passcode: otp,
                    },
                })
            }
            );

            console.log('EMAILJS MAIL SUCCESS TO:', toEmail, 'STATUS:', response.status);
            return response.status;

        } catch (error) {
            console.error('EMAILJS MAIL ERROR FOR:', toEmail, ':',
                error?.response?.data || error?.message);
        }
    }
}

