import { registerAs } from "@nestjs/config";
import ms, { StringValue } from "ms";   


export default registerAs('jwt', () => {
    if(!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }
        const accessExpire = process.env.JWT_ACCESS_EXPIRE! as StringValue;
        const refreshExpire = process.env.JWT_REFRESH_EXPIRE! as StringValue; 
    return {
    jwt_access_secret : process.env.JWT_ACCESS_SECRET as string,
    jwt_access_expire : accessExpire  ,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET as string ,
    jwt_refresh_expire : refreshExpire,

    jwt_refresh_expire_ms : ms(refreshExpire)
    }
})