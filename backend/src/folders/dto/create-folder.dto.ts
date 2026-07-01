import { Equals, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ComponentType } from "@prisma/client";

export class CreateFolderDto {
    @IsString({ message: "O campo name precisa ser do tipo string!" })
    @IsNotEmpty({ message: "O campo name é obrigatório!" })
    name!: string;

    @IsOptional()
    @IsUUID(undefined, { message: "Você deve informar um UUID válido para a pasta pai!" })
    parentId!: string | null;
}