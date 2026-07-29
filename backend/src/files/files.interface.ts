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
    fileType: string;
    fileSize: number;
    publicId: string;
    parentId: string;
}

export interface SignatureParams {
    publicId: string;
}

export interface CloudStorageDataDto {
    signature: string;
    apiKey: string;
    cloudName: string;
    publicId: string;
    timestamp: number;
}

export interface CompletedSignatureParams {
    publicId: string;
    timestamp: number;
}

export interface FileProperties {
    name: string;
    size: number;
    type: string;
    parentId: string;
    userId: string;
}

export interface FilePropertiesDto {
    name: string;
    size: number;
    type: string;
    parentId: string;
}