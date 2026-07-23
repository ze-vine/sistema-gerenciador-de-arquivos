import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CreateFileDto } from "./files.interface";
import { PrismaService } from '../prisma/prisma.service';
import { ComponentType } from '@prisma/client';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {

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