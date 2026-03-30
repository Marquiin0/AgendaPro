import Link from 'next/link';
import { Calendar, Store, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Store,
    title: 'Para Seu Negocio',
    description: 'Cadastre sua barbearia, clinica, estudio ou qualquer tipo de servico e gerencie tudo em um so lugar.',
  },
  {
    icon: Calendar,
    title: 'Agendamento Facil',
    description: 'Seus clientes escolhem o servico, profissional, dia e horario disponivel em poucos cliques.',
  },
  {
    icon: Clock,
    title: 'Horarios Disponiveis',
    description: 'Sistema inteligente que mostra apenas horarios livres, evitando conflitos de agenda.',
  },
  {
    icon: Users,
    title: 'Gestao de Equipe',
    description: 'Cadastre sua equipe, defina horarios de trabalho e servicos que cada profissional realiza.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Agende seus servicos
            <span className="block text-[var(--primary)]">de forma simples</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
            AgendaPro e a plataforma completa para negocios que oferecem servicos.
            Gerencie sua agenda, equipe e clientes em um so lugar.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Comece Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/businesses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explorar Negocios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Tudo que voce precisa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted-foreground)]">
            Seja dono de um negocio ou cliente, o AgendaPro tem a solucao ideal para voce.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-md">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-[var(--primary)]" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pronto para comecar?
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)]">
            Crie sua conta agora e comece a receber agendamentos online.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register?role=ADMIN">
              <Button size="lg" className="w-full sm:w-auto">
                Sou Dono de Negocio
              </Button>
            </Link>
            <Link href="/register?role=CLIENT">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sou Cliente
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
