import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertScheduleDto } from './dto/upsert-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async getByStaff(staffId: string) {
    return this.prisma.schedule.findMany({
      where: { staffId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async upsert(
    businessId: string,
    staffId: string,
    ownerId: string,
    dto: UpsertScheduleDto,
  ) {
    await this.verifyAccess(businessId, staffId, ownerId);

    const results = [];

    for (const entry of dto.schedules) {
      const result = await this.prisma.schedule.upsert({
        where: {
          staffId_dayOfWeek: {
            staffId,
            dayOfWeek: entry.dayOfWeek,
          },
        },
        update: {
          startTime: entry.startTime,
          endTime: entry.endTime,
          isActive: entry.isActive ?? true,
        },
        create: {
          staffId,
          dayOfWeek: entry.dayOfWeek,
          startTime: entry.startTime,
          endTime: entry.endTime,
          isActive: entry.isActive ?? true,
        },
      });
      results.push(result);
    }

    return results;
  }

  private async verifyAccess(businessId: string, staffId: string, ownerId: string) {
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

    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, businessId },
    });

    if (!staff) {
      throw new NotFoundException('Profissional nao encontrado neste negocio');
    }
  }
}
