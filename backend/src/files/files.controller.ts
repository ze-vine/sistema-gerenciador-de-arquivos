import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      url: cloudinaryResult.secure_url,
    }

    return await this.filesService.create(userId, fileData);
  }
}