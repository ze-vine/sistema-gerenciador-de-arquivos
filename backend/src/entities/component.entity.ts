import { ComponentType } from "@prisma/client";

export class Component {
    id!: string;
    name!: string;
    componentType!: ComponentType;
    parentType!: ComponentType | null;
    parentId!: string | null;
    userId!: string;
    createdAt!: Date;
}