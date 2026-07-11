import { Transform, Type } from "class-transformer";
import { IsBase64, IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, Min, ValidateIf } from "class-validator";

export class ComponentsQueryDto {

    @Transform(({ value }) => {
        if (value === 'null') return null;
        return value;
    })
    @ValidateIf((objeto, valor) => valor !== null)
    @IsOptional()
    @IsUUID(undefined, { message: "Você deve informar um UUID válido para a pasta pai!" })
    parentId!: string | null;

    @IsNumber({}, { message: "O campo limit deve ser obrigatoriamente um número!" })
    @Type(() => Number)
    @Min(1, { message: "Você deve passar um valor válido para o limite!" })
    @Max(50, { message: "Você não pode buscar por mais de 50 registros em uma única requisição!" })
    limit!: number;

    @Transform(({ value }) => {
        if (value === 'null') return null;
        return value;
    })
    @ValidateIf((objeto, valor) => valor !== null)
    @IsNotEmpty({ message: "O campo nextCursor não pode estar vazio!" })
    @IsBase64({}, { message: "O campo nextCursor deve estar codificado em base64!" })
    nextCursor!: string | null;
}