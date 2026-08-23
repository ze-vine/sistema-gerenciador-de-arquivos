import { ComponentSchema, ComponentType } from "@prisma/client";
import { Component, Folder } from "../folders/folders.interface";
import { File } from "../files/files.interface";

export class ComponentFactory {
    public static createComponent(data: ComponentSchema, componentType: ComponentType): Component {
        const baseComponent: Component = {
            id: data.id,
            name: data.name,
            componentType: data.componentType,
            parentId: data.parentId,
            parentType: data.parentType,
            userId: data.userId,
            createdAt: data.createdAt
        };
        switch (componentType) {
            case ComponentType.FOLDER:
                return baseComponent as Folder;
            case ComponentType.FILE:
                const file: File = {
                    ...baseComponent,
                    fileSize: data.fileSize,
                    fileType: data.fileType,
                    publicId: data.publicId,
                    url: data.url
                };
                return file;
            default:
                throw new RangeError("Esse tipo é inválido!");
        }
    }
}