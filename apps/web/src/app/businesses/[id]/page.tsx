'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Phone, Mail, Scissors, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ease, dur, stagger } from '@/lib/motion-config';

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
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--muted)]" />
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
      {/* Header — hero style */}
      <FadeInView>
        <div className="relative rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 border border-[var(--border)]/40 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[var(--primary)]/10 backdrop-blur-sm border border-[var(--primary)]/20 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                {business.category.name}
              </span>
              <h1 className="text-3xl font-bold mt-3">{business.name}</h1>
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
            <div className="sm:self-start">
              <Link href={`/businesses/${business.id}/book`}>
                <Button size="lg" className="w-full sm:w-auto shadow-[0_2px_8px_0_rgba(var(--primary-rgb,99_102_241)/0.3),0_4px_20px_0_rgba(var(--primary-rgb,99_102_241)/0.2)] hover:shadow-[0_2px_8px_0_rgba(var(--primary-rgb,99_102_241)/0.4),0_4px_20px_0_rgba(var(--primary-rgb,99_102_241)/0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                  Agendar Horario
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FadeInView>

      {/* Services */}
      <section className="mb-8">
        <FadeInView>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Servicos ({business.services.length})
          </h2>
        </FadeInView>
        {business.services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {business.services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: dur.base, ease: ease.smoothOut, delay: i * stagger.cards * 0.5 }}
              >
                <Card className="hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300">
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
                      <span className="text-lg font-bold text-[var(--primary)] rounded-full bg-[var(--primary)]/10 px-3 py-1">
                        R$ {parseFloat(service.price).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted-foreground)]">Nenhum servico disponivel.</p>
        )}
      </section>

      {/* Staff */}
      <section>
        <FadeInView>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipe ({business.staff.length})
          </h2>
        </FadeInView>
        {business.staff.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {business.staff.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: dur.base, ease: ease.smoothOut, delay: i * stagger.cards * 0.5 }}
              >
                <Card className="hover:border-[var(--primary)]/30 hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-medium ring-2 ring-[var(--primary)]/20 shadow-[0_0_15px_rgba(var(--primary-rgb,99_102_241)/0.1)]">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <span className="font-medium">{member.firstName} {member.lastName}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted-foreground)]">Nenhum profissional cadastrado.</p>
        )}
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden p-4 bg-[var(--background)]/90 backdrop-blur-xl border-t border-[var(--border)] z-40">
        <Link href={`/businesses/${business.id}/book`}>
          <Button size="lg" className="w-full">Agendar Horario</Button>
        </Link>
      </div>
    </div>
  );
}
