import { registerAs } from "@nestjs/config";


export default registerAs('hash', ()=> ({
    hash_key : process.env.SECRET_HMAC 
}))