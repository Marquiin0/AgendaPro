'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  client: { firstName: string; lastName: string };
  service: { name: string };
  staff: { firstName: string; lastName: string };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-200 border-yellow-400',
  CONFIRMED: 'bg-green-200 border-green-400',
  CANCELLED: 'bg-red-200 border-red-400 opacity-50',
  COMPLETED: 'bg-blue-200 border-blue-400',
};

export default function CalendarPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ['admin-appointments'],
    queryFn: () => api('/appointments', { token }),
    enabled: !!token,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  }, [year, month]);

  function getAppointmentsForDay(day: number) {
    if (!appointments) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter((a) => {
      const apptDate = new Date(a.startTime).toISOString().split('T')[0];
      return apptDate === dateStr && a.status !== 'CANCELLED';
    });
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[160px] text-center">
            {monthNames[month]} {year}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-2 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-[var(--muted-foreground)] py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="min-h-[60px] sm:min-h-[80px]" />;
              }

              const dayAppts = getAppointmentsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-[60px] sm:min-h-[80px] rounded-md border p-1 ${
                    isToday ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)]'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-[var(--primary)]' : ''}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayAppts.slice(0, 2).map((appt) => (
                      <div
                        key={appt.id}
                        className={`rounded px-1 py-0.5 text-[10px] leading-tight border truncate ${STATUS_COLORS[appt.status] || ''}`}
                        title={`${appt.service.name} - ${appt.client.firstName}`}
                      >
                        <span className="hidden sm:inline">
                          {new Date(appt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{' '}
                        </span>
                        {appt.client.firstName}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <div className="text-[10px] text-[var(--muted-foreground)] pl-1">
                        +{dayAppts.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
