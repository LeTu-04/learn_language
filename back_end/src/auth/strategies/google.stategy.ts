// import { Inject, Injectable } from "@nestjs/common";
// import type { ConfigType } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-google-oauth20";
// import googleOauthConfig from "../config/google-oauth.config";


// @Injectable()
// export class GoogleStrategy extends PassportStrategy (Strategy, 'google') {
//     constructor(
//         @Inject(googleOauthConfig.KEY)
//         private  googleConfig : ConfigType<typeof googleOauthConfig>
//     ) {
//         super({
//             clientID : googleConfig.clientID!,
//             clientSecret : googleConfig.ClientSecret!,
//             callbackURL : googleConfig.callbakURL,
//             scope : ['email', 'profile']
//             })
//     }
//     validate(...args: any[]) {
        
//     }
// }