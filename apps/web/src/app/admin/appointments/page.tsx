'use client';

import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AppointmentService {
  serviceName: string;
  durationMin: number;
  price: string;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: string;
  status: string;
  notes: string | null;
  client: { id: string; firstName: string; lastName: string; email: string; phone: string | null };
  services: AppointmentService[];
  staff: { firstName: string; lastName: string };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluido',
  NO_SHOW: 'Nao Compareceu',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
};

export default function AdminAppointmentsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ['admin-appointments'],
    queryFn: () => api('/appointments', { token }),
    enabled: !!token,
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/appointments/${id}/confirm`, { method: 'PATCH', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/appointments/${id}/cancel`, { method: 'PATCH', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }),
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Agendamentos</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-[var(--muted)]" />
          ))}
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const serviceNames = appt.services.map((s) => s.serviceName).join(', ');
            return (
              <Card key={appt.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">
                          {appt.client.firstName} {appt.client.lastName}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[appt.status]}`}>
                          {STATUS_LABELS[appt.status]}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {serviceNames} com {appt.staff.firstName} {appt.staff.lastName}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {formatDate(appt.startTime)} - {formatTime(appt.startTime)} ate {formatTime(appt.endTime)}
                      </p>
                      <p className="text-sm font-medium">
                        R$ {parseFloat(appt.totalPrice).toFixed(2)} &middot; {appt.totalDuration} min
                      </p>
                    </div>
                    {appt.status === 'PENDING' && (
                      <div className="flex gap-2 self-start">
                        <Button
                          size="sm"
                          onClick={() => confirmMutation.mutate(appt.id)}
                          disabled={confirmMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" /> Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelMutation.mutate(appt.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Quando clientes agendarem servicos, eles aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
}
