import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudStorageDataDto, CompletedSignatureParams, CreateFileDto, FileProperties, SignatureParams } from "./files.interface";
import { PrismaService } from '../prisma/prisma.service';
import { ComponentSchema, ComponentType } from '@prisma/client';
import { File } from './entities/file.entity';
import { Component } from '../entities/component.entity';

@Injectable()
export class FilesService {

  private readonly CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
  private readonly CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
  private readonly CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async remove(id: string) {
    const file = await this.prismaService.componentSchema.findUnique(
      { where: { id: id } }
    );

    if (!file) throw new NotFoundException("O arquivo não pode ser excluído, pois ele não existe!");

    const isFile = file.componentType === ComponentType.FILE;
    if (!isFile) throw new BadRequestException("Você só pode excluir um arquivo válido!");

    if (file.publicId !== null) {const result = await cloudinary.uploader.destroy(file.publicId);}

    return await this.prismaService.componentSchema.delete({ where: { id: id } });
  }

  async update(name: string, id: string, userId: string): Promise<Component> {
    const existingFile = await this.prismaService.componentSchema.findUnique({
      where: { id: id, userId: userId },
      select: { id: true }
    });

    if (!existingFile) throw new NotFoundException("O arquivo que você está tentando modificar não existe!");

    return await this.prismaService.componentSchema.update({
      where: { id: id },
      data: { name: name }
    })
  }

  async uploadFilev2(fileProperties: FileProperties): Promise<CloudStorageDataDto> {
    const file = await this.createFileMetadata(fileProperties);
    return this.generateSignedURL({ publicId: file.id });
  }

  private generateSignedURL(signatureParams: SignatureParams): CloudStorageDataDto {
    this.generateConfigurationObjectOfCloudinary();
    const completedSignatureParams = this.generateSignatureParams(signatureParams);
    const signature = this.generateSignature(completedSignatureParams)
    return {
      signature: signature,
      apiKey: this.CLOUDINARY_API_KEY,
      cloudName: this.CLOUDINARY_CLOUD_NAME,
      timestamp: completedSignatureParams.timestamp,
      publicId: completedSignatureParams.publicId
    };
  }

  private async createFileMetadata(fileMetadata: FileProperties) {
    return await this.prismaService.componentSchema.create({
      data: {
        name: fileMetadata.name,
        fileType: fileMetadata.type,
        fileSize: fileMetadata.size,
        componentType: ComponentType.FILE,
        parentType: fileMetadata.parentId !== null ? ComponentType.FOLDER : null,
        parentId: fileMetadata.parentId,
        userId: fileMetadata.userId,
      }
    });
  }

  private generateSignature(signatureParams: SignatureParams): string {
    return cloudinary.utils.api_sign_request(
      signatureParams,
      this.CLOUDINARY_API_SECRET
    );
  }

  private generateSignatureParams(signatureParams: SignatureParams): CompletedSignatureParams {
    return {
      ...signatureParams,
      timestamp: Math.floor(new Date().getTime() / 1000)
    }
  }

  private generateConfigurationObjectOfCloudinary(): void {
    cloudinary.config({
      cloudName: this.CLOUDINARY_CLOUD_NAME,
      apiKey: this.CLOUDINARY_API_KEY,
      apiSecret: this.CLOUDINARY_API_SECRET,
    });
  }

  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file) throw new BadRequestException('Arquivo não enviado');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('O upload do Cloudinary é inexistente!'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async create(userId: string, createFileDto: CreateFileDto): Promise<File> {
    const componentType = ComponentType.FILE;
    const newFile = { ...createFileDto, componentType, userId }

    return await this.prismaService.componentSchema.create({ data: newFile });
  }

};