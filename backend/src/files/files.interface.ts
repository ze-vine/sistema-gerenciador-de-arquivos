import { Component } from "../folders/folders.interface";

export interface File extends Component {
    url: string | null;
    fileType: string | null;
    fileSize: number | null;
    publicId: string | null;
}

export interface CreateFileDto {
    name: string;
    url: string;
    type: string;
    size: number;
    publicId: string;
    parentId: string;
}