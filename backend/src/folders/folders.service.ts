import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from './entities/folder.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class FoldersService {

  constructor(
    private prismaService: PrismaService
  ) {}

  async create(userId: string, createFolderDto: CreateFolderDto): Promise<Folder> {

    const folderSearchCondition = createFolderDto.folderId !== null
      ? { name: createFolderDto.name, folderId: createFolderDto.folderId }
      : { name: createFolderDto.name, userId: userId };

    const existingFolder = await this.searchForFolderInTheDatabase(folderSearchCondition);
    if (existingFolder) {
      throw new ConflictException("Uma pasta com esse nome já existe!");
    }

    if (createFolderDto.folderId !== null) {
      const parentFolder = await this.prismaService.folder.findUnique({
        where: { folderUserRelation: { id: createFolderDto.folderId, userId: userId } },
        select: { id: true }
      });

      if (!parentFolder) {
        throw new BadRequestException("A pasta pai informada não existe!");
      }
    }

    return await this.prismaService.folder.create({
      data: {
        ...createFolderDto,
        userId: userId
      },
    });

  }

  private async searchForFolderInTheDatabase(folderSearchCondition: any): Promise<Folder | null> {
    return await this.prismaService.folder.findUnique({
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