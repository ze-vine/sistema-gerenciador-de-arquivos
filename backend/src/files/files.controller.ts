import { Controller, Post, UseGuards, Delete, Param, ParseUUIDPipe, Req, Body, Patch, Headers, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from "@nestjs/common";
import type { Request } from "express";
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Component } from '../entities/component.entity';
import { UpdateFileDto } from './dto/update-file.dto';
import type { CloudStorageDataDto } from './files.interface';
import { CreateFileDto } from './dto/create-file.dto';
import { v2 as cloudinary } from "cloudinary";

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async getUserIdByCookies(@Req() request: Request, key: string): Promise<string> {
      const token = request.cookies[key];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload.sub;
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

  @Post("upload")
  @UseGuards(AuthGuard)
  async generateUploadSignature(@Req() request: Request, @Body() createFileDto: CreateFileDto): Promise<CloudStorageDataDto> {
    const userId = await this.getUserIdByCookies(request, "access_token");
    const fileParams = { ...createFileDto, userId };
    return this.filesService.generateSignatureToUpload(fileParams);
  }

  private validateCloudinaryWebhook(webhookBody, webhookHeader): boolean {
    const body = webhookBody;
    const timestamp = webhookHeader["x-cld-timestamp"];
    const signature = webhookHeader["x-cld-signature"];
    const result = cloudinary.utils.verifyNotificationSignature(body, timestamp, signature);
    return result;
  }

  @Post("create")
  async createFileMetadata(@Headers() webhookHeader, @Req() requestString: RawBodyRequest<Request>) {

    const webhookRawBody = requestString.rawBody?.toString("utf-8");

    if (!webhookRawBody) {
      throw new BadRequestException("Corpo da requisição ausente!");
    };

    if (!this.validateCloudinaryWebhook(webhookRawBody, webhookHeader)) {
      throw new UnauthorizedException("Assinatura do webhook inválida!");
    }

    let webhookBody;

    try {
      webhookBody = JSON.parse(webhookRawBody);
    } catch (error) {
      throw new BadRequestException("O payload do webhook não é um JSON válido");
    }

    const fileMetadata = {
      name: webhookBody.context.custom.name,
      type: webhookBody.format,
      size: webhookBody.bytes,
      parentId: webhookBody.context.custom.parentId,
      userId: webhookBody.context.custom.userId,
      createdAt: webhookBody.created_at,
      publicId: webhookBody.public_id
    };

    await this.filesService.createFileMetadata(fileMetadata);
  }
}