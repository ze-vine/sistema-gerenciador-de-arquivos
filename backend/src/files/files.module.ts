import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ComponentValidations } from '../utils/component-utils';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryProvider, ComponentValidations],
  exports: [FilesService, CloudinaryProvider],
})
export class FilesModule {}
