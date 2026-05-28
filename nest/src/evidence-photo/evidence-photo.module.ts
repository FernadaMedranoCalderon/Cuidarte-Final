import { Module } from '@nestjs/common';
import { EvidencePhotoService } from './evidence-photo.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [CloudinaryModule],
    providers: [EvidencePhotoService, PrismaService],
    exports: [EvidencePhotoService],
})
export class EvidencePhotoModule {}
