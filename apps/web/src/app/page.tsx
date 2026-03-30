'use client';

import Link from 'next/link';
import {
  Calendar, Store, Clock, Users, ArrowRight, Scissors, Stethoscope,
  Camera, Briefcase, Dumbbell, Sparkles, CheckCircle2, Star,
  ToggleRight, LayoutDashboard, CalendarDays, ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// ─── Animated Section Wrapper ───
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Animated Counter ───
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
}

// ─── Data ───
const categories = [
  { icon: Scissors, label: 'Barbearias' },
  { icon: Stethoscope, label: 'Clinicas' },
  { icon: Camera, label: 'Estudios' },
  { icon: Briefcase, label: 'Consultorias' },
  { icon: Dumbbell, label: 'Academias' },
  { icon: Sparkles, label: 'Spas' },
];

const steps = [
  {
    num: '01',
    title: 'Cadastre seu negocio',
    desc: 'Crie sua conta, escolha sua categoria e adicione as informacoes do seu negocio.',
    icon: Store,
  },
  {
    num: '02',
    title: 'Configure servicos e horarios',
    desc: 'Adicione seus servicos, precos, equipe e defina os horarios de atendimento.',
    icon: Clock,
  },
  {
    num: '03',
    title: 'Receba agendamentos',
    desc: 'Seus clientes agendam online 24/7. Voce gerencia tudo pelo painel.',
    icon: Calendar,
  },
];

const features = [
  {
    icon: CalendarDays,
    title: 'Agendamento 24/7',
    desc: 'Seus clientes agendam a qualquer hora, de qualquer lugar.',
  },
  {
    icon: ToggleRight,
    title: 'Multiplos Servicos',
    desc: 'Combine corte + barba em um unico agendamento com preco e duracao automaticos.',
  },
  {
    icon: Users,
    title: 'Gestao de Equipe',
    desc: 'Controle horarios individuais de cada profissional da sua equipe.',
  },
  {
    icon: LayoutDashboard,
    title: 'Painel Administrativo',
    desc: 'Servicos, equipe, agendamentos e calendario em um so lugar.',
  },
  {
    icon: CalendarDays,
    title: 'Calendario Inteligente',
    desc: 'Visualize sua agenda do dia, semana e mes com cores por status.',
  },
  {
    icon: ShieldCheck,
    title: 'Confirmacao Rapida',
    desc: 'Confirme ou cancele agendamentos com um unico clique.',
  },
];

const industries = [
  {
    icon: Scissors,
    title: 'Barbearias',
    desc: 'Cortes, barbas e luzes agendados sem dor de cabeca. Seus clientes escolhem o barbeiro e o servico.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Stethoscope,
    title: 'Clinicas',
    desc: 'Consultas organizadas com horarios definidos por especialidade e profissional.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Camera,
    title: 'Estudios',
    desc: 'Sessoes de foto, video ou gravacao sem conflitos de agenda entre projetos.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Briefcase,
    title: 'Consultorias',
    desc: 'Reunioes e mentorias agendadas no horario perfeito para ambos os lados.',
    color: 'from-orange-500 to-orange-600',
  },
];

const testimonials = [
  {
    name: 'Rafael Mendes',
    role: 'Dono',
    business: 'Barbearia Style',
    text: 'Desde que comecei a usar o AgendaPro, meus clientes agendam sozinhos e eu nao perco mais tempo no WhatsApp. Meus no-shows caíram pela metade!',
    rating: 5,
  },
  {
    name: 'Dra. Camila Santos',
    role: 'Diretora',
    business: 'Clinica Vida',
    text: 'A organizacao da agenda melhorou demais. Cada medico tem seu horario configurado e os pacientes conseguem agendar online sem ligar pra clinica.',
    rating: 5,
  },
  {
    name: 'Lucas Oliveira',
    role: 'Fotografo',
    business: 'Studio LO',
    text: 'Perfeito pra quem trabalha com sessoes de foto. Consigo configurar duracoes diferentes pra cada tipo de ensaio e tudo fica organizado.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-hidden">

      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--primary)]/10 -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/5 blur-3xl -z-10" />

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)] mb-6">
                <Sparkles className="h-4 w-4" />
                Plataforma de Agendamento #1
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Seu negocio{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-blue-400 bg-clip-text text-transparent">
                  sempre lotado.
                </span>
                <br />
                Sem esforco.
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0">
                A plataforma completa de agendamento online para barbearias, clinicas,
                estudios e muito mais. Seus clientes agendam 24/7 enquanto voce foca no que importa.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register?role=ADMIN">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all">
                    Comece Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl">
                    Veja como funciona
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                {[
                  { value: 500, suffix: '+', label: 'Negocios' },
                  { value: 10000, suffix: '+', label: 'Agendamentos' },
                  { value: 4.9, suffix: '', label: 'Avaliacao' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                      {stat.label === 'Avaliacao' ? (
                        <span className="flex items-center gap-1">
                          4.9 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </span>
                      ) : (
                        <Counter target={stat.value} suffix={stat.suffix} />
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual - Booking Preview */}
            <div className="flex-1 w-full max-w-lg lg:max-w-xl">
              <div className="relative">
                {/* Floating animation */}
                <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-6">
                  {/* Fake booking UI */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-[var(--muted-foreground)]">agendapro.com/booking</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">Escolha os servicos</h3>
                  {/* Fake service toggles */}
                  {[
                    { name: 'Corte Degrade', time: '30 min', price: 'R$ 45', active: true },
                    { name: 'Barba Completa', time: '20 min', price: 'R$ 30', active: true },
                    { name: 'Luzes', time: '60 min', price: 'R$ 120', active: false },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className={cn(
                        'flex items-center justify-between rounded-xl border-2 p-3 mb-2 transition-all',
                        s.active ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)]',
                      )}
                    >
                      <div>
                        <span className="font-medium text-sm">{s.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)] ml-2">{s.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--primary)]">{s.price}</span>
                        <div className={cn('w-10 h-6 rounded-full transition-colors', s.active ? 'bg-[var(--primary)]' : 'bg-gray-300')}>
                          <div className={cn('h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform', s.active ? 'translate-x-4' : 'translate-x-0.5')} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Fake cart */}
                  <div className="mt-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] p-3 text-center">
                    <span className="font-medium text-sm">2 servicos &middot; 50 min &middot; R$ 75,00</span>
                    <div className="text-xs opacity-80 mt-0.5">Continuar &rarr;</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-2xl bg-[var(--primary)]/10 -z-10 rotate-12" />
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-blue-400/10 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 2. TRUST BAR ══════════ */}
      <section className="border-y border-[var(--border)] bg-[var(--muted)]/50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-medium text-[var(--muted-foreground)] mb-6">
            IDEAL PARA TODOS OS TIPOS DE NEGOCIO
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {categories.map((cat) => (
              <div key={cat.label} className="flex flex-col items-center gap-2 group">
                <div className="h-12 w-12 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/5 transition-all">
                  <cat.icon className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. COMO FUNCIONA ══════════ */}
      <section id="como-funciona" className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              Simples e rapido
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Como funciona
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Em 3 passos simples, seu negocio estara recebendo agendamentos online.
            </p>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 150}>
                <div className="relative text-center group">
                  {/* Number */}
                  <div className="text-6xl font-black text-[var(--primary)]/10 mb-4">
                    {step.num}
                  </div>
                  {/* Icon */}
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-all duration-300">
                    <step.icon className="h-7 w-7 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--muted-foreground)] text-sm max-w-xs mx-auto">
                    {step.desc}
                  </p>
                  {/* Connector line (hidden on mobile, shown on desktop) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8">
                      <ChevronRight className="h-6 w-6 text-[var(--primary)]/30" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 4. FEATURES ══════════ */}
      <section className="px-4 py-20 bg-[var(--muted)]/50">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              Funcionalidades
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Tudo que seu negocio precisa
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 5. PREVIEW / DEMO ══════════ */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              Veja na pratica
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Uma experiencia incrivel para todos
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Interface intuitiva tanto para donos de negocio quanto para clientes.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Client View */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">
                <div className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-sm">Visao do Cliente</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h4 className="font-bold">Barbearia do Marco</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">Sao Paulo, SP</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Corte Degrade - 30min', 'Barba Completa - 20min'].map((s) => (
                      <div key={s} className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20 px-3 py-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                        <span className="text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['09:00', '09:30', '10:00', '10:30'].map((t, i) => (
                      <div
                        key={t}
                        className={cn(
                          'rounded-lg border text-center py-2 text-xs font-medium',
                          i === 2
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'border-[var(--border)]',
                        )}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin View */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">
                <div className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium text-sm">Visao do Admin</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Agendamentos Hoje', value: '12' },
                      { label: 'Receita do Dia', value: 'R$ 540' },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-[var(--border)] p-3">
                        <p className="text-xs text-[var(--muted-foreground)]">{s.label}</p>
                        <p className="text-xl font-bold">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { client: 'Joao Silva', service: 'Corte + Barba', time: '10:00', status: 'Confirmado', color: 'bg-green-100 text-green-700' },
                      { client: 'Maria Santos', service: 'Luzes', time: '11:00', status: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
                      { client: 'Pedro Costa', service: 'Corte Social', time: '14:00', status: 'Confirmado', color: 'bg-green-100 text-green-700' },
                    ].map((a) => (
                      <div key={a.client} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2">
                        <div>
                          <span className="text-sm font-medium">{a.client}</span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">{a.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--muted-foreground)]">{a.time}</span>
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', a.color)}>
                            {a.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════ 6. PARA QUEM E ══════════ */}
      <section className="px-4 py-20 bg-[var(--muted)]/50">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              Para todos os segmentos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Feito para o seu tipo de negocio
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.title} delay={i * 100}>
                <Card className="h-full border-0 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className={cn('h-2 bg-gradient-to-r', ind.color)} />
                  <CardContent className="p-6">
                    <div className={cn('h-12 w-12 rounded-xl bg-gradient-to-r flex items-center justify-center mb-4 text-white', ind.color)}>
                      <ind.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{ind.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">{ind.desc}</p>
                    <Link href="/register?role=ADMIN" className="inline-flex items-center text-sm font-medium text-[var(--primary)] hover:gap-2 transition-all">
                      Comece agora <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 7. DEPOIMENTOS ══════════ */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              Depoimentos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              O que nossos clientes dizem
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 150}>
                <Card className="h-full border-0 shadow-sm">
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm">
                        {t.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t.role}, {t.business}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 8. CTA FINAL ══════════ */}
      <section className="px-4 py-20 sm:py-28">
        <AnimatedSection>
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[var(--primary)] to-blue-600 p-8 sm:p-16 text-center text-white shadow-2xl shadow-[var(--primary)]/20">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para transformar seu negocio?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
              Crie sua conta gratis em menos de 2 minutos e comece a receber agendamentos hoje.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=ADMIN">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl bg-white text-[var(--primary)] hover:bg-white/90 shadow-lg">
                  Sou Dono de Negocio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=CLIENT">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 backdrop-blur">
                  Sou Cliente
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-70">
              Sem cartao de credito. Sem compromisso. Cancele quando quiser.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Float animation keyframe */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
