import { ComponentSchema, ComponentType } from "@prisma/client";
import { Component } from "../entities/component.entity";
import { Folder } from "../folders/entities/folder.entity";
import { File } from "../files/entities/file.entity";

export class ComponentFactory {
    public static createComponent(data: ComponentSchema, componentType: ComponentType): Component {
        switch (componentType) {
            case ComponentType.FOLDER:
                const folder = new Folder();
                folder.id = data.id;
                folder.name = data.name;
                folder.componentType = data.componentType
                folder.parentId = data.parentId;
                folder.parentType = data.parentType;
                folder.userId = data.userId;
                folder.createdAt = data.createdAt;
                return folder;
            case ComponentType.FILE:
                const file = new File();
                file.id = data.id;
                file.name = data.name;
                file.componentType = data.componentType
                file.parentId = data.parentId;
                file.parentType = data.parentType;
                file.userId = data.userId;
                file.createdAt = data.createdAt;
                file.fileSize = data.fileSize;
                file.fileType = data.fileType;
                file.publicId = data.publicId;
                file.url = data.url;   
                return file;
            default:
                throw new RangeError("Esse tipo é inválido!");
        }
    }
}