import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsNotEmpty()
    name! : string
}


export class updateCategory {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name? : string
}