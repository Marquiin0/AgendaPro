import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateBusinessDto) {
    const slug = this.generateSlug(dto.name);

    return this.prisma.business.create({
      data: {
        ...dto,
        slug,
        ownerId,
      },
      include: {
        category: true,
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async findAll(query?: { categoryId?: string; city?: string; search?: string }) {
    const where: any = { isActive: true };

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query?.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.business.findMany({
      where,
      include: {
        category: true,
        _count: { select: { services: true, staff: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          select: { id: true, firstName: true, lastName: true },
        },
        services: { where: { isActive: true }, orderBy: { name: 'asc' } },
        staff: { where: { isActive: true }, orderBy: { firstName: 'asc' } },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio nao encontrado');
    }

    return business;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.business.findFirst({
      where: { ownerId },
      include: {
        category: true,
        services: { orderBy: { name: 'asc' } },
        staff: { orderBy: { firstName: 'asc' } },
        _count: {
          select: { services: true, staff: true },
        },
      },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateBusinessDto) {
    await this.verifyOwnership(id, ownerId);

    const data: any = { ...dto };
    if (dto.name) {
      data.slug = this.generateSlug(dto.name);
    }

    return this.prisma.business.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.verifyOwnership(id, ownerId);

    return this.prisma.business.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async verifyOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio nao encontrado');
    }

    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('Voce nao tem permissao para editar este negocio');
    }
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const random = Math.random().toString(36).substring(2, 6);
    return `${base}-${random}`;
  }
}
