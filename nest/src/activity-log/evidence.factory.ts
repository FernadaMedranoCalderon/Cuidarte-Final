import { Injectable } from '@nestjs/common';
import { EvidencePhotoService } from '../evidence-photo/evidence-photo.service';
import { EvidenceMarkService } from '../evidence-mark/evidence-mark.service';
import { EvidenceLocationService } from '../evidence-location/evidence-location.service';
import { CreateEvidencePhotoDTO } from '../entities/dto/Evidence/CreateEvidencePhotoDTO';
import { CreateEvidenceMarkDTO } from '../entities/dto/Evidence/CreateEvidenceMarkDTO';
import { CreateEvidenceLocationDTO } from '../entities/dto/Evidence/CreateEvidenceLocationDTO';
import { EvidenceType } from '@prisma/client';

@Injectable()
export class EvidenceFactory {
    constructor(
        private photoService: EvidencePhotoService,
        private markService: EvidenceMarkService,
        private locationService: EvidenceLocationService,
    ) { }

    createPhoto(dto: CreateEvidencePhotoDTO, tx?: any) {
        return this.photoService.create(dto, tx);
    }

    createMark(dto: CreateEvidenceMarkDTO, tx?: any) {
        return this.markService.create(dto, tx);
    }

    createLocation(dto: CreateEvidenceLocationDTO, tx?: any) {
        return this.locationService.create(dto, tx);
    }

    async create(type: EvidenceType, dto: any, tx: any) { 
        switch (type) {
            case EvidenceType.PHOTO:
                return this.createPhoto(dto, tx); 
            case EvidenceType.MARK:
                return this.createMark(dto, tx); 
            case EvidenceType.LOCATION:
                return this.createLocation(dto, tx);
            default:
                throw new Error('Invalid evidence type');
        }
    }
}