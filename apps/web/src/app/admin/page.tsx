'use client';

import { useSession } from 'next-auth/react';
import { Store, Users, Calendar, Scissors } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { title: 'Agendamentos Hoje', value: '0', icon: Calendar },
  { title: 'Servicos Ativos', value: '0', icon: Scissors },
  { title: 'Equipe', value: '0', icon: Users },
  { title: 'Negocio', value: 'Configurar', icon: Store },
];

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">
        Painel Administrativo
      </h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Ola, {session?.user?.firstName}! Gerencie seu negocio aqui.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
