'use client';

import { useSession } from 'next-auth/react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">
        Ola, {session?.user?.firstName || 'Usuario'}!
      </h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Bem-vindo ao seu painel de agendamentos.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximos Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Nenhum agendamento futuro
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Seus Agendamentos</h2>
        <div className="rounded-lg border border-[var(--border)] p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <h3 className="mt-4 text-lg font-medium">Nenhum agendamento ainda</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Explore negocios e faca seu primeiro agendamento!
          </p>
        </div>
      </div>
    </div>
  );
}
