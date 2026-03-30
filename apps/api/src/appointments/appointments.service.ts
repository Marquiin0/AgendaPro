import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateAppointmentDto) {
    // Fetch all selected services
    const services = await this.prisma.service.findMany({
      where: { id: { in: dto.serviceIds }, isActive: true },
    });

    if (services.length !== dto.serviceIds.length) {
      throw new NotFoundException('Um ou mais servicos nao foram encontrados');
    }

    // Calculate total duration and price
    const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);
    const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    // Check for conflicting appointments within a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          staffId: dto.staffId,
          status: { notIn: ['CANCELLED'] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (conflict) {
        throw new ConflictException('Este horario ja esta ocupado');
      }

      return tx.appointment.create({
        data: {
          clientId,
          staffId: dto.staffId,
          startTime,
          endTime,
          totalDuration,
          totalPrice,
          notes: dto.notes,
          services: {
            create: services.map((s) => ({
              serviceId: s.id,
              serviceName: s.name,
              price: s.price,
              durationMin: s.durationMin,
            })),
          },
        },
        include: {
          services: { include: { service: true } },
          staff: true,
          client: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });
    });

    return result;
  }

  async findByClient(clientId: string) {
    return this.prisma.appointment.findMany({
      where: { clientId },
      include: {
        services: {
          include: {
            service: { include: { business: { include: { category: true } } } },
          },
        },
        staff: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findByBusiness(ownerId: string) {
    const business = await this.prisma.business.findFirst({
      where: { ownerId },
    });

    if (!business) {
      return [];
    }

    return this.prisma.appointment.findMany({
      where: {
        services: {
          some: { service: { businessId: business.id } },
        },
      },
      include: {
        services: { include: { service: true } },
        staff: true,
        client: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        services: {
          include: { service: { include: { business: true } } },
        },
        staff: true,
        client: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento nao encontrado');
    }

    return appointment;
  }

  async cancel(id: string, userId: string) {
    const appointment = await this.findOne(id);

    const isClient = appointment.clientId === userId;
    const business = appointment.services[0]?.service?.business;
    const isOwner = business?.ownerId === userId;

    if (!isClient && !isOwner) {
      throw new ForbiddenException('Sem permissao para cancelar');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { services: { include: { service: true } }, staff: true },
    });
  }

  async confirm(id: string, userId: string) {
    const appointment = await this.findOne(id);
    const business = appointment.services[0]?.service?.business;

    if (!business || business.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono do negocio pode confirmar');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CONFIRMED' },
      include: { services: { include: { service: true } }, staff: true },
    });
  }

  async reschedule(id: string, userId: string, newStartTime: string) {
    const appointment = await this.findOne(id);

    const isClient = appointment.clientId === userId;
    const business = appointment.services[0]?.service?.business;
    const isOwner = business?.ownerId === userId;

    if (!isClient && !isOwner) {
      throw new ForbiddenException('Sem permissao para reagendar');
    }

    const startTime = new Date(newStartTime);
    const endTime = new Date(startTime.getTime() + appointment.totalDuration * 60000);

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        staffId: appointment.staffId,
        id: { not: id },
        status: { notIn: ['CANCELLED'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflict) {
      throw new ConflictException('Novo horario ja esta ocupado');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { startTime, endTime, status: 'PENDING' },
      include: { services: { include: { service: true } }, staff: true },
    });
  }
}
