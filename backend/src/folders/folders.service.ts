import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from "./entities/folder.entity";
import { ComponentType } from '@prisma/client';
import { ReadComponentsDto } from './dto/read-components.dto';

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
      const parentFolder = await this.prismaService.component.findUnique({
        where: { id: createFolderDto.parentId },
        select: { id: true }
      });

      if (!parentFolder) {
        throw new BadRequestException("A pasta pai informada não existe!");
      }
    }

    const folder = await this.prismaService.component.create({
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
    return await this.prismaService.component.findFirst({
      where: folderSearchCondition
    });
  }

  async findRecordsByFolder(parentId: string | null, limit: number, pageToken: string | null) {
    let whereCondition;

    if (pageToken !== null) {
      const decodedPageToken = await this.decodeBase64ToString(pageToken)
      console.log(decodedPageToken)
      whereCondition = { parentId: parentId, id: { lt: decodedPageToken } };
    } else {
      whereCondition = { parentId: parentId }
    }

    const components = await this.prismaService.component.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      take: limit + 1
    });
    let newPageToken: string | null = null

    if (components.length == limit + 1) {
      components.pop()
      const lastComponentId = components[limit - 1].id
      newPageToken = await this.decodeStringToBase64(lastComponentId)
    }

    const readComponentsDto = new ReadComponentsDto();
    readComponentsDto.data = components;
    readComponentsDto.pageToken = newPageToken

    return readComponentsDto
  }

  private async decodeBase64ToString(base64: string) {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  private async decodeStringToBase64(text: string) {
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