import { Component } from "../../entities/component.entity";

export class ReadComponentsDto {
    data!: Component[];
    pageToken!: string | null;
}