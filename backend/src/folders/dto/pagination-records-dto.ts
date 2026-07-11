import { Component } from "../../entities/component.entity";
import { NextCursor } from "./page-token";

export class PaginationRecordsDto {
    data!: Component[];
    meta!: NextCursor;

    constructor(data: Component[], meta: NextCursor) {
        this.data = data;
        this.meta = meta;
    }
}