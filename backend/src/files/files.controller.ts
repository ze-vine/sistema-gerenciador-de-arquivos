import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Get, Delete, Param, ParseUUIDPipe, Req, ConflictException, Body, Patch } from '@nestjs/common';
import type { Request } from "express";
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ComponentValidations } from '../utils/component-utils';
import { ComponentType } from '@prisma/client';
import { Component } from '../entities/component.entity';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private componentValidations: ComponentValidations
  ) {}

  private async getUserIdByCookies(@Req() request: Request, key: string): Promise<string> {
      const token = request.cookies[key];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload.sub
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateFileDto: UpdateFileDto, @Req() request: Request): Promise<Component> {
    const { name } = updateFileDto;
    const userId = await this.getUserIdByCookies(request, "access_token");
    return await this.filesService.update(name, id, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Component> {
    return this.filesService.remove(id);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file',
    {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
          return callback(new BadRequestException('Apenas imagens e PDFs são permitidos!'), false);
        }
        callback(null, true);
      },
    }
  ))

  async uploadAndCreateFileInTheDatabase(@UploadedFile() file: Express.Multer.File, parentId: string, @Req() request: Request) {

    const userId = await this.getUserIdByCookies(request, "access_token");
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const componentType = ComponentType.FILE;

    this.componentValidations.validateComponent(fileName, parentId, userId, componentType);
    
    const cloudinaryResult = await this.filesService.uploadFile(file);

    const fileData = {
      name: fileName,
      type: file.mimetype,
      size: file.size,
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      parentId: parentId
    }

    return await this.filesService.create(userId, fileData);
  }

}