import { Component } from "../../entities/component.entity";

export class File extends Component {
    url!: string | null;
    fileType!: string | null;
    fileSize!: number | null;
    publicId!: string | null;
}