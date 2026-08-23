import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFolderDto {
    @IsString({ message: "O campo name precisa ser do tipo string!" })
    @IsNotEmpty({ message: "O campo name é obrigatório!" })
    name!: string;
}