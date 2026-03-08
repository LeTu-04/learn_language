import { registerAs } from "@nestjs/config";

export default registerAs('googleOAuth', () => ({
    clientID : process.env.CUSTOMER_ID,
    ClientSecret :process.env.CUSTOMER_SECRET,
    //callbakURL : process.env.GOOOGLE_CALLBACK_URL
}))