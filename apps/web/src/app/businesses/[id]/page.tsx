'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Phone, Mail, Scissors, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Business {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  category: { name: string };
  owner: { firstName: string; lastName: string };
  services: { id: string; name: string; description: string | null; durationMin: number; price: string }[];
  staff: { id: string; firstName: string; lastName: string }[];
}

export default function BusinessDetailPage() {
  const { id } = useParams();

  const { data: business, isLoading } = useQuery<Business>({
    queryKey: ['business', id],
    queryFn: () => api(`/businesses/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="h-10 w-64 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-6 w-96 animate-pulse rounded bg-[var(--muted)]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-[var(--muted)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Negocio nao encontrado</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-[var(--primary)] font-medium">{business.category.name}</p>
          <h1 className="text-3xl font-bold mt-1">{business.name}</h1>
          {business.description && (
            <p className="mt-2 text-[var(--muted-foreground)]">{business.description}</p>
          )}
          <div className="mt-4 space-y-1">
            {business.address && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <MapPin className="h-4 w-4" />
                {business.address}
                {business.city && `, ${business.city}`}
                {business.state && ` - ${business.state}`}
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Phone className="h-4 w-4" />
                {business.phone}
              </div>
            )}
            {business.email && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Mail className="h-4 w-4" />
                {business.email}
              </div>
            )}
          </div>
        </div>
        <Link href={`/businesses/${business.id}/book`}>
          <Button size="lg" className="w-full sm:w-auto">
            Agendar Horario
          </Button>
        </Link>
      </div>

      {/* Services */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Servicos ({business.services.length})
        </h2>
        {business.services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {business.services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">{service.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-[var(--muted-foreground)]">
                        <Clock className="h-3 w-3" />
                        {service.durationMin} min
                      </div>
                    </div>
                    <span className="text-lg font-bold text-[var(--primary)]">
                      R$ {parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted-foreground)]">Nenhum servico disponivel.</p>
        )}
      </section>

      {/* Staff */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Equipe ({business.staff.length})
        </h2>
        {business.staff.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {business.staff.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-medium">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <span className="font-medium">{member.firstName} {member.lastName}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted-foreground)]">Nenhum profissional cadastrado.</p>
        )}
      </section>
    </div>
  );
}
