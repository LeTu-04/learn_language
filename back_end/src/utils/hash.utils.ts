import { Inject } from "@nestjs/common";
import { createHmac } from "node:crypto";
import hashConfig from "../auth/config/hash.config";
import type { ConfigType } from "@nestjs/config";


export class GenerateHashService {
    constructor(
        @Inject(hashConfig.KEY)
        private readonly hashCfg :ConfigType<typeof hashConfig>
    ) {}
    createHmacForOtpValue (email:string, opt : string) {
        return createHmac('sha256', this.hashCfg.hash_key!)
        .update(`${email}${opt}`)
        .digest('hex')
    }
    
    generateOtp () {
        const otpNumber = Math.floor(100000 +  Math.random()* 900000);
        return otpNumber.toString();
    }
}