import { registerAs } from "@nestjs/config";

export default registerAs('redis', ()=> ({
    redis_port : process.env.REDIS_PORT,
    redis_host : process.env.REDIS_HOST,
    redis_password : process.env.REDIS_PASSWORD,
}))