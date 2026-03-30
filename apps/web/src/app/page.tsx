'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  { icon: CalendarDays, title: 'Agendamento 24/7', desc: 'Seus clientes agendam a qualquer hora, de qualquer lugar.' },
  { icon: ToggleRight, title: 'Multiplos Servicos', desc: 'Combine corte + barba em um unico agendamento com preco e duracao automaticos.' },
  { icon: Users, title: 'Gestao de Equipe', desc: 'Controle horarios individuais de cada profissional da sua equipe.' },
  { icon: LayoutDashboard, title: 'Painel Administrativo', desc: 'Servicos, equipe, agendamentos e calendario em um so lugar.' },
  { icon: CalendarDays, title: 'Calendario Inteligente', desc: 'Visualize sua agenda do dia, semana e mes com cores por status.' },
  { icon: ShieldCheck, title: 'Confirmacao Rapida', desc: 'Confirme ou cancele agendamentos com um unico clique.' },
];

const industries = [
  { icon: Scissors, title: 'Barbearias', desc: 'Cortes, barbas e luzes agendados sem dor de cabeca. Seus clientes escolhem o barbeiro e o servico.', color: 'from-blue-500 to-blue-600', image: '/images/Barbearia.png' },
  { icon: Stethoscope, title: 'Clinicas', desc: 'Consultas organizadas com horarios definidos por especialidade e profissional.', color: 'from-green-500 to-green-600', image: '/images/Clinica.png' },
  { icon: Camera, title: 'Estudios', desc: 'Sessoes de foto, video ou gravacao sem conflitos de agenda entre projetos.', color: 'from-purple-500 to-purple-600', image: '/images/Estudio.png' },
  { icon: Briefcase, title: 'Consultorias', desc: 'Reunioes e mentorias agendadas no horario perfeito para ambos os lados.', color: 'from-orange-500 to-orange-600', image: '/images/Consultoria.png' },
  { icon: Dumbbell, title: 'Academias', desc: 'Aulas, personal trainers e avaliacoes agendadas com controle total da grade horaria.', color: 'from-sky-500 to-sky-600', image: '/images/Academia.png' },
  { icon: Sparkles, title: 'Spas', desc: 'Massagens, tratamentos e terapias organizados com horarios por profissional e sala.', color: 'from-pink-500 to-pink-600', image: '/images/Spa.png' },
];

const testimonials = [
  { name: 'Rafael Mendes', role: 'Dono', business: 'Barbearia Style', text: 'Desde que comecei a usar o AgendaPro, meus clientes agendam sozinhos e eu nao perco mais tempo no WhatsApp. Meus no-shows cairam pela metade!', rating: 5 },
  { name: 'Dra. Camila Santos', role: 'Diretora', business: 'Clinica Vida', text: 'A organizacao da agenda melhorou demais. Cada medico tem seu horario configurado e os pacientes conseguem agendar online sem ligar pra clinica.', rating: 5 },
  { name: 'Lucas Oliveira', role: 'Fotografo', business: 'Studio LO', text: 'Perfeito pra quem trabalha com sessoes de foto. Consigo configurar duracoes diferentes pra cada tipo de ensaio e tudo fica organizado.', rating: 5 },
];

export default function HomePage() {
  return (
    <div className="relative flex flex-col">

      {/* ══════════ 1. HERO ══════════ */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Animated background orbs - CSS only, GPU accelerated */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/[0.07] blur-[100px] animate-[drift_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-400/[0.05] blur-[80px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-400/[0.04] blur-[60px] animate-[pulse_8s_ease-in-out_infinite]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--primary)] mb-6 animate-[fadeSlideUp_0.6s_ease-out]">
                <Sparkles className="h-4 w-4" />
                Plataforma de Agendamento #1
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] animate-[fadeSlideUp_0.8s_ease-out]">
                Seu negocio{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-blue-400 bg-clip-text text-transparent">
                  sempre lotado.
                </span>
                <br />
                Sem esforco.
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0 animate-[fadeSlideUp_1s_ease-out]">
                A plataforma completa de agendamento online para barbearias, clinicas,
                estudios e muito mais. Seus clientes agendam 24/7 enquanto voce foca no que importa.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-[fadeSlideUp_1.2s_ease-out]">
                <Link href="/register?role=ADMIN">
                  <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-105 transition-all">
                    Comece Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full hover:scale-105 transition-all">
                    Veja como funciona
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 animate-[fadeSlideUp_1.4s_ease-out]">
                {[
                  { value: 500, suffix: '+', label: 'Negocios' },
                  { value: 10000, suffix: '+', label: 'Agendamentos' },
                  { value: 4.9, suffix: '', label: 'Avaliacao' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {stat.label === 'Avaliacao' ? (
                        <span className="flex items-center gap-1">4.9 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /></span>
                      ) : (
                        <Counter target={stat.value} suffix={stat.suffix} />
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual - Mockup */}
            <div className="flex-1 w-full max-w-lg lg:max-w-xl animate-[fadeSlideUp_1s_ease-out]">
              <div className="relative">
                <div className="animate-[float_6s_ease-in-out_infinite]">
                  <Image
                    src="/images/MockupAgendaPro.png"
                    alt="AgendaPro - Painel Administrativo e App Mobile"
                    width={1400}
                    height={900}
                    className="rounded-2xl drop-shadow-2xl"
                    priority
                  />
                </div>
                {/* Glow behind mockup */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--primary)]/10 blur-2xl -z-10 animate-[pulse_4s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 2. TRUST BAR ══════════ */}
      <section className="border-y border-[var(--border)]/40 bg-[var(--muted)]/30 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-medium text-[var(--muted-foreground)] mb-6 uppercase tracking-widest">
            Ideal para todos os tipos de negocio
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {categories.map((cat) => (
              <div key={cat.label} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="h-12 w-12 rounded-full bg-[var(--background)]/80 backdrop-blur border border-[var(--border)]/60 flex items-center justify-center group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 group-hover:scale-110 transition-all duration-300">
                  <cat.icon className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. COMO FUNCIONA ══════════ */}
      <section id="como-funciona" className="relative px-4 py-20 sm:py-28 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--primary)]/[0.03] blur-[100px] -z-10" />

        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Simples e rapido</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Como funciona</h2>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Em 3 passos simples, seu negocio estara recebendo agendamentos online.
            </p>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 150}>
                <div className="relative text-center group">
                  <div className="text-7xl font-black text-[var(--primary)]/[0.07] mb-4 select-none">{step.num}</div>
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/25">
                    <step.icon className="h-7 w-7 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--muted-foreground)] text-sm max-w-xs mx-auto">{step.desc}</p>
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
      <section className="relative px-4 py-20 bg-[var(--muted)]/30 overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 -z-10 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, blue 0%, transparent 50%)',
        }} />

        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Funcionalidades</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Tudo que seu negocio precisa</h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <Card className="h-full border-0 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default group">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
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
      <section className="relative px-4 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/[0.04] blur-[100px] -z-10 animate-[drift_30s_ease-in-out_infinite]" />

        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Veja na pratica</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Uma experiencia incrivel para todos</h2>
            <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Interface intuitiva tanto para donos de negocio quanto para clientes.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Client View */}
              <div className="rounded-2xl border border-[var(--border)]/60 bg-[var(--card)]/80 backdrop-blur-md shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                      <div key={s} className="flex items-center gap-2 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 px-3 py-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                        <span className="text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['09:00', '09:30', '10:00', '10:30'].map((t, i) => (
                      <div key={t} className={cn('rounded-2xl border text-center py-2 text-xs font-medium', i === 2 ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]' : 'border-[var(--border)]')}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin View */}
              <div className="rounded-2xl border border-[var(--border)]/60 bg-[var(--card)]/80 backdrop-blur-md shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium text-sm">Visao do Admin</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Agendamentos Hoje', value: '12' }, { label: 'Receita do Dia', value: 'R$ 540' }].map((s) => (
                      <div key={s.label} className="rounded-2xl border border-[var(--border)]/60 p-3">
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
                      <div key={a.client} className="flex items-center justify-between rounded-2xl border border-[var(--border)]/60 px-3 py-2">
                        <div>
                          <span className="text-sm font-medium">{a.client}</span>
                          <span className="text-xs text-[var(--muted-foreground)] ml-2">{a.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--muted-foreground)]">{a.time}</span>
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', a.color)}>{a.status}</span>
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
      <section className="relative px-4 py-20 bg-[var(--muted)]/30 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full bg-blue-400/[0.03] blur-[100px] -z-10" />

        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Para todos os segmentos</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Feito para o seu tipo de negocio</h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.title} delay={i * 100} className="h-full">
                <Card className="h-full border-0 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ind.image}
                      alt={ind.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={cn('absolute inset-0 bg-gradient-to-t from-black/40 to-transparent')} />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className={cn('h-10 w-10 rounded-full bg-gradient-to-r flex items-center justify-center mb-3 text-white -mt-10 relative z-10 ring-4 ring-[var(--card)] group-hover:scale-110 transition-transform duration-300', ind.color)}>
                      <ind.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{ind.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">{ind.desc}</p>
                    <Link href="/register?role=ADMIN" className="inline-flex items-center text-sm font-medium text-[var(--primary)] group-hover:translate-x-1 transition-transform mt-auto">
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
      <section className="relative px-4 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-400/[0.03] blur-[80px] -z-10 animate-[drift_22s_ease-in-out_infinite_reverse]" />

        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl font-bold">O que nossos clientes dizem</h2>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 150}>
                <Card className="h-full border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed italic flex-1">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm shrink-0">
                        {t.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{t.role}, {t.business}</p>
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
          <div className="relative mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[var(--primary)] to-blue-600 p-8 sm:p-16 text-center text-white shadow-2xl shadow-[var(--primary)]/20 overflow-hidden">
            {/* Subtle animated glow inside CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-[drift_15s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-[drift_18s_ease-in-out_infinite_reverse]" />

            <h2 className="relative text-3xl sm:text-4xl font-bold">
              Pronto para transformar seu negocio?
            </h2>
            <p className="relative mt-4 text-lg opacity-90 max-w-xl mx-auto">
              Crie sua conta gratis em menos de 2 minutos e comece a receber agendamentos hoje.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register?role=ADMIN">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white text-[var(--primary)] hover:bg-white/90 hover:scale-105 shadow-lg transition-all">
                  Sou Dono de Negocio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=CLIENT">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 hover:scale-105 backdrop-blur transition-all">
                  Sou Cliente
                </Button>
              </Link>
            </div>
            <p className="relative mt-6 text-sm opacity-70">
              Sem cartao de credito. Sem compromisso. Cancele quando quiser.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* CSS Animations - GPU accelerated, no JS scroll listeners */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(-20px, 15px); }
          75% { transform: translate(15px, 25px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
