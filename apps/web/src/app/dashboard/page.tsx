'use client';

import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Calendar, X, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppointmentService {
  serviceName: string;
  durationMin: number;
  price: string;
  service: {
    business: { id: string; name: string; category: { name: string } };
  };
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: string;
  status: string;
  notes: string | null;
  services: AppointmentService[];
  staff: { firstName: string; lastName: string };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluido',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['my-appointments'],
    queryFn: () => api('/appointments', { token }),
    enabled: !!token,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/appointments/${id}/cancel`, { method: 'PATCH', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] }),
  });

  const upcoming = appointments?.filter(
    (a) => new Date(a.startTime) >= new Date() && a.status !== 'CANCELLED',
  ) || [];
  const past = appointments?.filter(
    (a) => new Date(a.startTime) < new Date() || a.status === 'CANCELLED',
  ) || [];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Ola, {session?.user?.firstName || 'Usuario'}!</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">Seus agendamentos em um so lugar.</p>

      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximos</CardTitle>
            <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcoming.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Proximos Agendamentos</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((appt) => {
              const business = appt.services[0]?.service?.business;
              const serviceNames = appt.services.map((s) => s.serviceName).join(', ');
              return (
                <Card key={appt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{serviceNames}</h3>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[appt.status]}`}>
                            {STATUS_LABELS[appt.status]}
                          </span>
                        </div>
                        {business && (
                          <p className="text-sm text-[var(--muted-foreground)]">
                            <Link href={`/businesses/${business.id}`} className="hover:underline">
                              {business.name}
                            </Link>
                            {' '}com {appt.staff.firstName} {appt.staff.lastName}
                          </p>
                        )}
                        <p className="text-sm">
                          {formatDate(appt.startTime)} - {formatTime(appt.startTime)} ate {formatTime(appt.endTime)}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {appt.totalDuration} min
                        </p>
                        <p className="text-sm font-medium text-[var(--primary)]">
                          R$ {parseFloat(appt.totalPrice).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2 self-start">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelMutation.mutate(appt.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
            <h3 className="mt-4 text-lg font-medium">Nenhum agendamento futuro</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Explore negocios e faca seu primeiro agendamento!
            </p>
            <Link href="/businesses">
              <Button className="mt-4">
                <Store className="h-4 w-4 mr-2" /> Explorar Negocios
              </Button>
            </Link>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Historico</h2>
          <div className="space-y-3">
            {past.map((appt) => {
              const business = appt.services[0]?.service?.business;
              const serviceNames = appt.services.map((s) => s.serviceName).join(', ');
              return (
                <Card key={appt.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{serviceNames}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[appt.status]}`}>
                        {STATUS_LABELS[appt.status]}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {business?.name} - {formatDate(appt.startTime)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
