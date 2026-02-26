import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsNotEmpty()
    name! : string
}

export class CreateVocabularyDto {
    @IsString()
    @IsNotEmpty()
    word! : string;
    @IsString()
    @IsNotEmpty()
    mean! : string
    @IsOptional()
    example! : string
    @IsNotEmpty()
    @IsNumber()
    categoryId!: number 
}

export class updateCategory {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name? : string
}