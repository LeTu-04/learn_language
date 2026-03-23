import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

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

export class UpdateFavorite {
    @IsNumber()
    @IsNotEmpty()
    id : number
    @IsBoolean()
    @IsNotEmpty()
    isFavorite : boolean
}

export class BathUpdateFavoriteDto {
    @IsArray()
    @ValidateNested({each : true})
    @Type(() => UpdateFavorite)
    changes : UpdateFavorite[]
}