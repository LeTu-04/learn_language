import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsNotEmpty()
    name! : string
    @IsNotEmpty()
    @IsString()
    userId! : string
}


export class updateCategory {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name? : string
}