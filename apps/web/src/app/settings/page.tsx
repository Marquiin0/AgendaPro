'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Configuracoes</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Gerencie suas informacoes de perfil.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Informacoes Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-[var(--muted-foreground)]">Nome</span>
            <p className="font-medium">{session?.user?.name}</p>
          </div>
          <div>
            <span className="text-sm text-[var(--muted-foreground)]">Email</span>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div>
            <span className="text-sm text-[var(--muted-foreground)]">Tipo de Conta</span>
            <p className="font-medium">
              {session?.user?.role === 'ADMIN' ? 'Dono de Negocio' : 'Cliente'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
