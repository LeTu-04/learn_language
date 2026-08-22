import { Injectable, OnModuleInit } from "@nestjs/common";



@Injectable()

export class ResendService {

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
                    accessToken: process.env.EMAILJS_PRIVATE_KEY,
                    template_params: {
                        email: toEmail,
                        passcode: otp,
                    },
                })
            }
            );

            return response.status;

        } catch (error) {
            console.error('EMAILJS MAIL ERROR FOR:', toEmail, ':',
                error?.response?.data || error?.message);
        }
    }
}

