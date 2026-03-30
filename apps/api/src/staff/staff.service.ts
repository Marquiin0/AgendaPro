import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(businessId: string, ownerId: string, dto: CreateStaffDto) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    return this.prisma.staff.create({
      data: {
        ...dto,
        businessId,
      },
      include: { schedules: true },
    });
  }

  async findByBusiness(businessId: string) {
    return this.prisma.staff.findMany({
      where: { businessId, isActive: true },
      include: { schedules: { orderBy: { dayOfWeek: 'asc' } } },
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: { schedules: { orderBy: { dayOfWeek: 'asc' } } },
    });

    if (!staff) {
      throw new NotFoundException('Profissional nao encontrado');
    }

    return staff;
  }

  async update(id: string, businessId: string, ownerId: string, dto: UpdateStaffDto) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    const staff = await this.prisma.staff.findFirst({
      where: { id, businessId },
    });

    if (!staff) {
      throw new NotFoundException('Profissional nao encontrado');
    }

    return this.prisma.staff.update({
      where: { id },
      data: dto,
      include: { schedules: true },
    });
  }

  async remove(id: string, businessId: string, ownerId: string) {
    await this.verifyBusinessOwnership(businessId, ownerId);

    return this.prisma.staff.update({
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
