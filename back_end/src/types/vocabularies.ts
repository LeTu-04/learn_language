import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVocabularyDto {
    @IsString()
    @IsNotEmpty()
    word! : string;
    @IsString()
    @IsNotEmpty()
    mean! : string
    @IsOptional()
    example? : string
}
