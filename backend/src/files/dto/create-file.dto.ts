import { IsDefined, IsNotEmpty, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateFileDto {
    @IsString({ message: "O campo name precisa ser do tipo string!" })
    @IsNotEmpty({ message: "O campo name é obrigatório!" })
    name!: string;

    @IsDefined({ message: 'O campo parentId deve existir no payload' })
    @ValidateIf((object, value) => value !== null)
    @IsUUID(undefined, { message: "Você deve informar um UUID válido para a pasta pai!" })
    parentId!: string;
}