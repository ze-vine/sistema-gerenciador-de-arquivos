import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ComponentsQueryDto } from './dto/components-query.dto';
import { PaginationRecordsDto } from './folders.interface';
import { Folder } from './entities/folder.entity';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  private async getUserIdByCookies(request: Request, key: string): Promise<string> {
    const token = request.cookies[key];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return payload.sub
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() request: Request, @Body() createFolderDto: CreateFolderDto): Promise<Folder> {
    const userId = await this.getUserIdByCookies(request, "access_token");
    return this.foldersService.create(userId, createFolderDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findRecordsByFolder(@Req() request: Request, @Query() componentsQueryDto: ComponentsQueryDto): Promise<PaginationRecordsDto>  {
    const userId = await this.getUserIdByCookies(request, "access_token");
    const { parentId, limit, nextCursor } = componentsQueryDto;
    return await this.foldersService.findRecordsByFolder(userId, parentId, limit, nextCursor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foldersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.foldersService.update(+id, updateFolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foldersService.remove(+id);
  }
}