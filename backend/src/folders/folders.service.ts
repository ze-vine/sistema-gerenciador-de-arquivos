import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from "./entities/folder.entity";
import { ComponentSchema, ComponentType } from '@prisma/client';
import { PaginationRecordsDto } from './dto/pagination-records-dto';
import { NextCursor } from './dto/page-token';
import { ComponentFactory } from '../factories/component.factory';
import { Component } from '../entities/component.entity';

type WhereConditionWithNextCursor = { userId: string, parentId: string | null, id: string | {} };
type WhereConditionWithoutNextCursor = { userId: string, parentId: string | null };

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
    const newNextCursor = this.createNextCursor(databaseComponents, limit);
    const filteredComponents = this.filterReturnedComponents(databaseComponents);
    return new PaginationRecordsDto(filteredComponents, new NextCursor(newNextCursor));
  }

  private filterReturnedComponents(databaseComponents: ComponentSchema[]): Component[] {
    return databaseComponents.map(component => ComponentFactory.createComponent(component, component.componentType));
  }

  private async findRecordsByFolderInDatabase(whereCondition: WhereConditionWithNextCursor | WhereConditionWithoutNextCursor, limit: number): Promise<ComponentSchema[]> {
    return await this.prismaService.componentSchema.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      take: limit + 1
    });
  }

  private createWhereCondition(userId: string, parentId: string | null, nextCursor: string | null): WhereConditionWithNextCursor | WhereConditionWithoutNextCursor {
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

  update(id: number, updateFolderDto: UpdateFolderDto) {
    return `This action updates a #${id} folder`;
  }

  remove(id: number) {
    return `This action removes a #${id} folder`;
  }
}