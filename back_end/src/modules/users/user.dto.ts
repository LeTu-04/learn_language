import { IsNotEmpty, IsString } from "class-validator"

export class ChangeNameUserDto {
    @IsString()
    newName : string
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPass : string
    @IsString()
    newPass : string
}