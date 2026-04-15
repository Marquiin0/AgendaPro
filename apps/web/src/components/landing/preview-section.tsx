'use client';

import { Users, Store, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { CounterAnimated } from '@/components/motion/counter-animated';
import { ease, dur } from '@/lib/motion-config';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export function PreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotateX1 = useTransform(scrollYProgress, [0, 0.5], [-3, -1]);
  const translateZ1 = useTransform(scrollYProgress, [0, 0.5], [-20, 0]);
  const rotateX2 = useTransform(scrollYProgress, [0, 0.5], [-4, -1]);
  const translateZ2 = useTransform(scrollYProgress, [0, 0.5], [-30, 0]);

  return (
    <section ref={sectionRef} className="relative px-4 py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/[0.04] blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <FadeInView className="text-center mb-12">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Veja na pratica</p>
          <TextReveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Uma experiencia incrivel para todos
          </TextReveal>
          <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Interface intuitiva tanto para donos de negocio quanto para clientes.
          </p>
        </FadeInView>

        <div className="grid gap-8 md:grid-cols-2" style={{ perspective: '1200px' }}>
          {/* Client View */}
          <motion.div
            style={{ rotateX: rotateX1, translateZ: translateZ1 }}
            initial={{ clipPath: 'inset(5% round 16px)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% round 16px)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: dur.medium, ease: ease.smoothOut }}
            className="rounded-2xl border border-[var(--border)]/60 bg-[var(--card)]/70 backdrop-blur-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 text-[var(--primary-foreground)] px-6 py-3 flex items-center gap-2">
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
                  <motion.div
                    key={t}
                    className={cn(
                      'rounded-2xl border text-center py-2 text-xs font-medium',
                      i === 2
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'border-[var(--border)]',
                    )}
                    animate={i === 2 ? { scale: [1, 1.02, 1] } : undefined}
                    transition={i === 2 ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  >
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Admin View */}
          <motion.div
            style={{ rotateX: rotateX2, translateZ: translateZ2 }}
            initial={{ clipPath: 'inset(5% round 16px)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% round 16px)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: dur.medium, ease: ease.smoothOut, delay: 0.1 }}
            className="rounded-2xl border border-[var(--border)]/60 bg-[var(--card)]/70 backdrop-blur-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-medium text-sm">Visao do Admin</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border)]/60 p-3">
                  <p className="text-xs text-[var(--muted-foreground)]">Agendamentos Hoje</p>
                  <p className="text-xl font-bold">
                    <CounterAnimated target={12} />
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)]/60 p-3">
                  <p className="text-xs text-[var(--muted-foreground)]">Receita do Dia</p>
                  <p className="text-xl font-bold">R$ <CounterAnimated target={540} /></p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { client: 'Joao Silva', service: 'Corte + Barba', time: '10:00', status: 'Confirmado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                  { client: 'Maria Santos', service: 'Luzes', time: '11:00', status: 'Pendente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
                  { client: 'Pedro Costa', service: 'Corte Social', time: '14:00', status: 'Confirmado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
