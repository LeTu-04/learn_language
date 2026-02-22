import { IsNotEmpty, IsOptional, IsString } from "class-validator"

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
    exaple! : string
}