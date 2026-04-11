import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CreateFileDto } from './dto/create-file.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {

  constructor(private readonly prisma: PrismaService) {}

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

  async create(userId: string, createFileDto: CreateFileDto) {
    return this.prisma.file.create({
      data: {
        ...createFileDto,
        user: {
          connect: { id: userId }
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        size: true,
        createdAt: true,
      }
    });
  }
}