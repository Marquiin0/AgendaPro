import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DayOfWeek } from '@agendapro/database';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(staffId: string, totalDurationMin: number, dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    const dayIndex = date.getDay();
    const dayMap: Record<number, DayOfWeek> = {
      0: 'SUNDAY',
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
    };
    const dayOfWeek = dayMap[dayIndex];

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        staffId_dayOfWeek: { staffId, dayOfWeek },
      },
    });

    if (!schedule || !schedule.isActive) {
      return [];
    }

    // Generate all possible slots based on total duration
    const slots = this.generateSlots(
      schedule.startTime,
      schedule.endTime,
      totalDurationMin,
    );

    // Get existing appointments for this staff on this date
    const startOfDay = new Date(dateStr + 'T00:00:00');
    const endOfDay = new Date(dateStr + 'T23:59:59');

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        staffId,
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
        status: { notIn: ['CANCELLED'] },
      },
    });

    // Filter out occupied slots
    const availableSlots = slots.filter((slot) => {
      const slotStart = new Date(`${dateStr}T${slot.startTime}:00`);
      const slotEnd = new Date(`${dateStr}T${slot.endTime}:00`);

      return !existingAppointments.some((appt) => {
        const apptStart = new Date(appt.startTime);
        const apptEnd = new Date(appt.endTime);
        return slotStart < apptEnd && slotEnd > apptStart;
      });
    });

    return availableSlots;
  }

  private generateSlots(
    startTime: string,
    endTime: string,
    durationMin: number,
  ): { startTime: string; endTime: string }[] {
    const slots: { startTime: string; endTime: string }[] = [];

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let currentMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    // Use 15-min intervals for slot start times
    const interval = 15;

    while (currentMin + durationMin <= endMin) {
      const slotStartH = Math.floor(currentMin / 60);
      const slotStartM = currentMin % 60;
      const slotEndMin = currentMin + durationMin;
      const slotEndH = Math.floor(slotEndMin / 60);
      const slotEndM = slotEndMin % 60;

      slots.push({
        startTime: `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`,
        endTime: `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`,
      });

      currentMin += interval;
    }

    return slots;
  }
}
