import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Request, Get, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Request() request) {
    return this.filesService.findAll(request.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() request) {
    return this.filesService.remove(id, request.user.sub);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file',
    {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
          return callback(new BadRequestException('Apenas imagens e PDFs são permitidos!'), false);
        }
        callback(null, true);
      },
    }
  ))
  async uploadAndCreateFileInTheDatabase(@UploadedFile() file: Express.Multer.File, @Request() request) {

    const userId = request.user.sub;

    const cloudinaryResult = await this.filesService.uploadFile(file);

    const fileData = {
      name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      type: file.mimetype,
      size: file.size,
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    }

    return await this.filesService.create(userId, fileData);
  }
}