import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ComponentsQueryDto } from './dto/components-query.dto';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() request: Request, @Body() createFolderDto: CreateFolderDto) {
    const token = request.cookies["access_token"];
    const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
    });
    const userId = payload.sub
    return this.foldersService.create(userId, createFolderDto);
  }

  @Get()
  async findAll(@Query() componentsQueryDto: ComponentsQueryDto) {
    const { parentId, limit, pageToken } = componentsQueryDto;
    console.log(componentsQueryDto)
    return await this.foldersService.findRecordsByFolder(parentId, limit, pageToken);
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