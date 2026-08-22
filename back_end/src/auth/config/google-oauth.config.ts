import { registerAs } from "@nestjs/config";

export default registerAs('googleOAuth', () => ({
    clientID : process.env.CUSTOMER_ID,
}))