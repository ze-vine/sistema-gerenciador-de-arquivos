import { ComponentType } from "@prisma/client";

export interface Component {
    id: string;
    name: string;
    componentType: ComponentType;
    parentType: ComponentType | null;
    parentId: string | null;
    userId: string;
    createdAt: Date;
}

export interface Folder extends Component {}

export interface NextCursor {
    nextCursor: string | null;
}

export interface PaginationRecordsDto {
    data: Component[];
    meta: NextCursor;
}

export interface ComponentNextCursorWhere { 
    userId: string;
    parentId: string | null;
    id: string | { lt: string };
}

export interface ComponentGeneralWhere {
    userId: string;
    parentId: string | null;
}

export type ComponentWhere = ComponentGeneralWhere | ComponentNextCursorWhere;