'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: string;
  status: string;
  client: { firstName: string; lastName: string; email: string };
  staff: { firstName: string; lastName: string; business: { name: string } };
  services: { serviceName: string; price: string; durationMin: number }[];
}

interface PaginatedResponse {
  data: Appointment[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  NO_SHOW: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Nao compareceu',
};

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

export default function SuperAdminAppointments() {
  const { data: session } = useSession();
  const [result, setResult] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (statusFilter) params.set('status', statusFilter);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    const res = await fetch(`${API_URL}/super-admin/appointments?${params}`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }, [session, page, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Agendamentos</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {result?.total || 0} agendamentos na plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="COMPLETED">Concluido</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="NO_SHOW">Nao compareceu</option>
        </select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="w-auto"
          placeholder="De"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="w-auto"
          placeholder="Ate"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--muted)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : result?.data.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
            <p className="text-[var(--muted-foreground)]">Nenhum agendamento encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Servicos</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Profissional</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Negocio</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Valor</th>
                </tr>
              </thead>
              <tbody>
                {result?.data.map((a) => (
                  <tr key={a.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium">{a.client.firstName} {a.client.lastName}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{a.client.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {a.services.map((s) => s.serviceName).join(', ')}
                    </td>
                    <td className="py-3 px-4">{a.staff.firstName} {a.staff.lastName}</td>
                    <td className="py-3 px-4">{a.staff.business.name}</td>
                    <td className="py-3 px-4">
                      <div>{new Date(a.startTime).toLocaleDateString('pt-BR')}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {new Date(a.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(a.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[a.status] || ''}`}>
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(a.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {result?.data.map((a) => (
              <Card key={a.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{a.client.firstName} {a.client.lastName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[a.status] || ''}`}>
                      {STATUS_LABELS[a.status] || a.status}
                    </span>
                  </div>
                  <p className="text-sm">{a.services.map((s) => s.serviceName).join(', ')}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {a.staff.firstName} {a.staff.lastName} — {a.staff.business.name}
                  </p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      {new Date(a.startTime).toLocaleDateString('pt-BR')}{' '}
                      {new Date(a.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-semibold">{formatCurrency(a.totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {result && result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[var(--muted-foreground)]">
                Pagina {result.page} de {result.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                disabled={page === result.totalPages}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
