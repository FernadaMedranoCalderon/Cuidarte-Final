import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvidencePhotoDTO } from '../entities/dto/Evidence/CreateEvidencePhotoDTO';
import { EvidencePhotoDTO } from '../entities/dto/Evidence/EvidencePhotoDTO';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class EvidencePhotoService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateEvidencePhotoDTO, tx: any = this.prisma) {
        const { createReadStream } = await dto.file;
        const stream = createReadStream();

        const photoUrl = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'evidences' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!.secure_url);
                }
            );
            stream.on('error', reject).pipe(uploadStream);
        });

        return tx.evidencePhoto.create({
            data: {
                photoUrl: photoUrl,
                activityLogId: dto.activityLogId,
            },
        });
    }

    async findById(id: number): Promise<EvidencePhotoDTO | null> {
        return this.prisma.evidencePhoto.findUnique({
            where: { id },
        }) as Promise<EvidencePhotoDTO | null>;
    }

    async findByActivityLog(activityLogId: number): Promise<EvidencePhotoDTO | null> {
        return this.prisma.evidencePhoto.findUnique({
            where: { activityLogId },
        }) as Promise<EvidencePhotoDTO | null>;
    }

    async findAll(): Promise<EvidencePhotoDTO[]> {
        return this.prisma.evidencePhoto.findMany() as Promise<EvidencePhotoDTO[]>;
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.evidencePhoto.delete({
            where: { id },
        });
        return true;
    }
}
