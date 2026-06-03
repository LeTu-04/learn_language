import { registerAs } from "@nestjs/config";

export default registerAs('mail', ()=> ({
    mail_user : process.env.MAIL_USER,
    mail_pass : process.env.MAIL_PASS
}))