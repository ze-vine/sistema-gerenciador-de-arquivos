import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from "./entities/folder.entity";
import { ComponentSchema, ComponentType } from '@prisma/client';
import { PaginationRecordsDto } from './folders.interface';
import { ComponentFactory } from '../factories/component.factory';
import { Component } from './folders.interface';
import { ComponentWhere } from './folders.interface';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FoldersService {

  constructor(
    private prismaService: PrismaService
  ) {}

  async create(userId: string, createFolderDto: CreateFolderDto): Promise<Folder> {

    const folderSearchCondition: { name: string, parentId: string } | { name: string, userId: string } = createFolderDto.parentId !== null
      ? { name: createFolderDto.name, parentId: createFolderDto.parentId }
      : { name: createFolderDto.name, userId: userId };

    const existingFolder = await this.searchForFolderInTheDatabase(folderSearchCondition);

    if (existingFolder) {
      throw new ConflictException("Uma pasta com esse nome já existe!");
    }
    
    if (createFolderDto.parentId !== null) {
      const parentFolder = await this.prismaService.componentSchema.findUnique({
        where: { id: createFolderDto.parentId },
        select: { id: true }
      });

      if (!parentFolder) {
        throw new BadRequestException("A pasta pai informada não existe!");
      }
    }

    const folder = await this.prismaService.componentSchema.create({
      data: {
        ...createFolderDto,
        componentType: ComponentType.FOLDER,
        userId: userId
      },
    });

    return {
      id: folder.id,
      name: folder.name,
      componentType: folder.componentType,
      parentType: folder.parentType,
      parentId: folder.parentId,
      userId: folder.userId,
      createdAt: folder.createdAt
    }
  }

  private async searchForFolderInTheDatabase(folderSearchCondition: { name: string, parentId: string } | { name: string, userId: string }): Promise<Folder | null> {
    return await this.prismaService.componentSchema.findFirst({
      where: folderSearchCondition
    });
  }

  async findRecordsByFolder(userId: string, parentId: string | null, limit: number, nextCursor: string | null): Promise<PaginationRecordsDto> {
    const whereConditionBySearch = this.createWhereCondition(userId, parentId, nextCursor);
    const databaseComponents = await this.findRecordsByFolderInDatabase(whereConditionBySearch, limit);
    const valueNextCursor = this.createNextCursor(databaseComponents, limit);
    const newNextCursor = { nextCursor: valueNextCursor };
    const filteredComponents = this.filterReturnedComponents(databaseComponents);
    return {
      data: filteredComponents,
      meta: newNextCursor
    }
  }

  private filterReturnedComponents(databaseComponents: ComponentSchema[]): Component[] {
    return databaseComponents.map(component => ComponentFactory.createComponent(component, component.componentType));
  }

  private async findRecordsByFolderInDatabase(whereCondition: ComponentWhere, limit: number): Promise<ComponentSchema[]> {
    return await this.prismaService.componentSchema.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      take: limit + 1
    });
  }

  private createWhereCondition(userId: string, parentId: string | null, nextCursor: string | null): ComponentWhere {
    if (nextCursor !== null) {
      const decodedNextCursor = this.decodeBase64ToString(nextCursor)
      return { userId: userId, parentId: parentId, id: { lt: decodedNextCursor } };
    }
    return { userId: userId, parentId: parentId }
  }

  private createNextCursor(databaseComponents: ComponentSchema[], limit: number): string | null {
    if (databaseComponents.length == limit + 1) {
      databaseComponents.pop();
      const lastComponentId = databaseComponents[databaseComponents.length - 1].id;
      return this.decodeStringToBase64(lastComponentId);
    }
    return null;
  }

  private decodeBase64ToString(base64: string): string {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  private decodeStringToBase64(text: string): string {
    return Buffer.from(text, 'utf-8').toString('base64');
  }

  findOne(id: number) {
    return `This action returns a #${id} folder`;
  }

  async update(id: string, userId: string, name: string): Promise<Component> {
    const folder = await this.prismaService.componentSchema.findUnique({
      where: { id: id, userId: userId }
    });

    if (!folder) throw new NotFoundException("A pasta que você está tentando modificar não existe!");

    return await this.prismaService.componentSchema.update({
      where: { id: id },
      data: { name: name }
    });
  }

  async remove(id: string, userId: string) {
    const folder = await this.prismaService.componentSchema.findUnique({
       where: { id: id, userId: userId },
       select: { id: true } 
    });

    if (!folder) throw new NotFoundException("A pasta que você está tentando excluir não existe!");

    const publicIdsOfFiles = await this.prismaService.componentSchema.findMany({
      where: { componentType: ComponentType.FILE, parentId: id },
      select: { publicId: true }
    });

    if (publicIdsOfFiles.length > 0) {
      for (const data of publicIdsOfFiles) {
        if (data.publicId !== null) await cloudinary.uploader.destroy(data.publicId);
      }
    }

    await this.prismaService.componentSchema.delete({ where: { id: id } });
  }
}