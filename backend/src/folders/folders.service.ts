import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FoldersService {

  constructor(private prismaService: PrismaService) {}

  async create(userId: string, createFolderDto: CreateFolderDto): Promise<Folder> {
    
    if (createFolderDto.folderId === null) {
      const folder = await this.prismaService.folder.findUnique({
        where: { name: createFolderDto.name, userId: userId }
      });

      if (folder) throw new ConflictException("Uma pasta com esse nome já existe!");

      const newFolder = await this.prismaService.folder.create({
        data: {
          ...createFolderDto,
          userId: userId
        }
      });

      return newFolder;
    }

    const folder = await this.prismaService.folder.findUnique({
        where: { name: createFolderDto.name, folderId: createFolderDto.folderId }
    });
    
    if (folder) throw new ConflictException("Uma pasta com esse nome já existe!");
    
    const parentFolder = await this.prismaService.folder.findUnique({
      where: {folderUserRelation: { id: createFolderDto.folderId, userId: userId }},
      select: { userId: true }
    });

    if (!parentFolder) {
      throw new BadRequestException("A pasta pai informada não existe!");
    };
    if (parentFolder.userId !== userId) {
      throw new ForbiddenException("Você não têm permissão para inserir pastas na conta de outro usuário");
    };

    const newFolder = await this.prismaService.folder.create({
      data: {
        ...createFolderDto,
        userId: userId
      },
    });

    return newFolder;
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