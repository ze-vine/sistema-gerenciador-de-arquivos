import { ComponentType } from "@prisma/client";
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
    public_id: string;
    upload_preset: string;
    timestamp: number;
    context: string;
}

export interface CloudStorageDataDto {
    signature: string;
    apiKey: string;
    urlCloud: string;
    signatureParams: SignatureParams;
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

export interface FileMetadata {
    name: string;
    type: string;
    size: number;
    parentId: string;
    userId: string;
    createdAt: Date;
    publicId: string;
}

export interface ComponentParams {
    name: string;
    parentId: string;
    userId: string;
    componentType: ComponentType;
}