import { Component } from "../folders/folders.interface";

export interface File extends Component {
    url: string | null;
    fileType: string | null;
    fileSize: number | null;
    publicId: string | null;
}