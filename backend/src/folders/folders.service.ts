import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from "./entities/folder.entity";
import { Component } from '../entities/component.entity';
import { ComponentType, Prisma } from '@prisma/client';

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

    return await this.prismaService.component.create({
      data: {
        ...createFolderDto,
        componentType: ComponentType.FOLDER,
        userId: userId
      },
    });

  }

  private async searchForFolderInTheDatabase(folderSearchCondition: { name: string, parentId: string } | { name: string, userId: string }): Promise<Folder | null> {
    return await this.prismaService.component.findFirst({
      where: folderSearchCondition
    });
  }

  findAll() {
    return `This action returns all folders`;
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