import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(businessId: string, ownerId: string, dto: CreateServiceDto) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    return this.prisma.service.create({
      data: {
        ...dto,
        businessId,
      },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, businessId: string, ownerId: string, dto: UpdateServiceDto) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    const service = await this.prisma.service.findFirst({
      where: { id, businessId },
    });

    if (!service) {
      throw new NotFoundException('Servico nao encontrado');
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, businessId: string, ownerId: string) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async verifyBusinessOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio nao encontrado');
    }

    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('Sem permissao');
    }
  }
}
