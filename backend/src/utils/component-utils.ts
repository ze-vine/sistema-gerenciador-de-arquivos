import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Component } from "../entities/component.entity";
import { ComponentType } from "@prisma/client";
import { ComponentParams } from "../files/files.interface";

@Injectable()
export class ComponentValidations {

    constructor ( private prismaService: PrismaService ) {}

    async validateComponent(componentParams: ComponentParams): Promise<void> {
        const { name, parentId, userId, componentType } = componentParams;
        const hasParent = parentId !== null;
        const queryCondition =  hasParent ? { name: name, parentId: parentId } : { name: name, userId: userId };
        const existingComponent = await this.searchForComponentInTheDatabase(queryCondition);

        if (existingComponent) {
            let message;

            switch (componentType) {
                case ComponentType.FOLDER:
                    message = "Uma pasta com esse nome já existe!";
                    break;
                case ComponentType.FILE:
                    message = "Um arquivo com esse nome já existe!";
                    break;
                default:
                    message = "Tipo de componente inválido!"
            }

            throw new ConflictException(message);
        }
        
        if (hasParent) {
            this.checkIfFolderExists(parentId);
        }
    }

    private async checkIfFolderExists(id: string): Promise<void> {
        const folder = await this.prismaService.componentSchema.findUnique({
            where: { id: id },
            select: { id: true }
        });

        if (!folder) {
            throw new BadRequestException("A pasta pai informada não existe!");
        }   
    }

    private async searchForComponentInTheDatabase (searchCondition: { name: string, parentId: string } | { name: string, userId: string }): Promise<Component | null> {
        return await this.prismaService.componentSchema.findFirst({
            where: searchCondition
        });
    }

}