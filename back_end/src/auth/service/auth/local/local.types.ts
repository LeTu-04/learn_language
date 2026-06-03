import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    email! : string 

    @IsString()
    @IsNotEmpty()
    password! : string
  
}

export class SignUpDto extends SignInDto{
    @IsString()
    @IsNotEmpty()
    inputotp : string
}