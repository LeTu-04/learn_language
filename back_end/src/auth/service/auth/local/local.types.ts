import { IsNotEmpty, IsString } from "class-validator";

export class SignIn_Up {
    @IsString()
    @IsNotEmpty()
    email! : string 

    @IsString()
    @IsNotEmpty()
    password! : string
}