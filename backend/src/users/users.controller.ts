import { Controller, Post, Body, Patch, Param, ParseUUIDPipe, UseGuards, Request, ForbiddenException, Delete, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getMe(@Param('id', new ParseUUIDPipe()) id: string, @Request() request) {
    if (id !== request.user.sub) throw new ForbiddenException("Você não tem permissão para acessar os dados de outro usuário!");
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update (
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() request,
  ) {

    if (id !== request.user.sub) throw new ForbiddenException("Você não tem permissão para atualizar outro usuário!");

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request,
  ) {

    if (id !== request.user.sub) throw new ForbiddenException("Você não tem permissão para excluir outro usuário!");

    return this.usersService.remove(id);
  }
}
