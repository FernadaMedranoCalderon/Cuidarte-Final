import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.providet';

@Module({
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}