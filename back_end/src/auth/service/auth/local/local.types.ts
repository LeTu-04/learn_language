import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SendOtpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;
}

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


export class ReGainPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email : string

    @IsString()
    @IsNotEmpty()
    otp : string

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    newPassword : string
}