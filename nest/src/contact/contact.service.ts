import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDTO } from '../entities/dto/Contact/CreateContactDTO';
import { UpdateContactDTO } from '../entities/dto/Contact/UpdateContactDTO';
import { ContactDTO } from '../entities/dto/Contact/ContactDTO';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateContactDTO): Promise<ContactDTO> {
        const contact = await this.prisma.contact.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                elderlyId: dto.elderlyId,
            },
        });
        return contact as ContactDTO;
    }

    async findById(id: number): Promise<ContactDTO | null> {
        return this.prisma.contact.findUnique({
            where: { id },
        }) as Promise<ContactDTO | null>;
    }

    async findByElderly(elderlyId: number): Promise<ContactDTO[]> {
        return this.prisma.contact.findMany({
            where: { elderlyId },
        }) as Promise<ContactDTO[]>;
    }

    async findAll(): Promise<ContactDTO[]> {
        return this.prisma.contact.findMany() as Promise<ContactDTO[]>;
    }

    async update(dto: UpdateContactDTO): Promise<ContactDTO> {
        const contact = await this.prisma.contact.update({
            where: { id: dto.id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.phone && { phone: dto.phone }),
            },
        });
        return contact as ContactDTO;
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.contact.delete({
            where: { id },
        });
        return true;
    }
}