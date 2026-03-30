import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalBusinesses,
      totalAppointments,
      revenueResult,
      newUsersThisMonth,
      newBusinessesThisMonth,
      appointmentsByStatus,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.business.count(),
      this.prisma.appointment.count(),
      this.prisma.appointment.aggregate({
        _sum: { totalPrice: true },
        where: { status: 'COMPLETED' },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.business.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.appointment.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const item of appointmentsByStatus) {
      statusCounts[item.status] = item._count.status;
    }

    return {
      totalUsers,
      totalBusinesses,
      totalAppointments,
      totalRevenue: revenueResult._sum.totalPrice?.toNumber() || 0,
      newUsersThisMonth,
      newBusinessesThisMonth,
      appointmentsByStatus: statusCounts,
    };
  }

  async getTimeline(months = 12) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const [users, businesses, appointments] = await Promise.all([
      this.prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      this.prisma.business.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      this.prisma.appointment.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, totalPrice: true, status: true },
      }),
    ]);

    const monthLabels: string[] = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
      monthLabels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const groupByMonth = (items: { createdAt: Date }[]) => {
      const counts: Record<string, number> = {};
      for (const label of monthLabels) counts[label] = 0;
      for (const item of items) {
        const key = `${item.createdAt.getFullYear()}-${String(item.createdAt.getMonth() + 1).padStart(2, '0')}`;
        if (counts[key] !== undefined) counts[key]++;
      }
      return monthLabels.map((month) => ({ month, count: counts[month] }));
    };

    const revenueByMonth: Record<string, number> = {};
    for (const label of monthLabels) revenueByMonth[label] = 0;
    for (const apt of appointments) {
      if (apt.status === 'COMPLETED') {
        const key = `${apt.createdAt.getFullYear()}-${String(apt.createdAt.getMonth() + 1).padStart(2, '0')}`;
        if (revenueByMonth[key] !== undefined) {
          revenueByMonth[key] += apt.totalPrice.toNumber();
        }
      }
    }

    return {
      users: groupByMonth(users),
      businesses: groupByMonth(businesses),
      appointments: groupByMonth(appointments),
      revenue: monthLabels.map((month) => ({ month, value: revenueByMonth[month] })),
    };
  }

  async getBusinesses(page = 1, limit = 10, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { city: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
          category: { select: { name: true } },
          _count: { select: { services: true, staff: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.business.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUsers(page = 1, limit = 10, role?: string, search?: string) {
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: { select: { businesses: true, appointments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getAppointments(
    page = 1,
    limit = 10,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.startTime = {};
      if (dateFrom) where.startTime.gte = new Date(dateFrom);
      if (dateTo) where.startTime.lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          client: { select: { firstName: true, lastName: true, email: true } },
          staff: {
            select: {
              firstName: true,
              lastName: true,
              business: { select: { name: true } },
            },
          },
          services: { select: { serviceName: true, price: true, durationMin: true } },
        },
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
