'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <FadeInView>
        <div className="relative mx-auto max-w-4xl rounded-3xl overflow-hidden p-8 sm:p-16 text-center text-white shadow-2xl shadow-[var(--primary)]/20">
          {/* Multi-layer gradient background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `
                radial-gradient(ellipse at 30% 0%, var(--primary) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 100%, oklch(0.4 0.2 264) 0%, transparent 50%),
                linear-gradient(135deg, var(--primary) 0%, oklch(0.35 0.2 264) 100%)
              `,
            }}
          />

          {/* Noise texture overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] -z-[5] pointer-events-none">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>

          {/* Animated orbs */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{
              x: [0, 30, -20, 15, 0],
              y: [0, -20, 15, 25, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl"
            animate={{
              x: [0, -25, 20, -10, 0],
              y: [0, 15, -20, 10, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
          />

          <TextReveal as="h2" className="relative text-3xl sm:text-4xl font-bold" delay={0}>
            Pronto para transformar seu negocio?
          </TextReveal>

          <FadeInView delay={0.3}>
            <p className="relative mt-4 text-lg opacity-90 max-w-xl mx-auto">
              Crie sua conta gratis em menos de 2 minutos e comece a receber agendamentos hoje.
            </p>
          </FadeInView>

          <FadeInView delay={0.5}>
            <div className="relative mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register?role=ADMIN">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white text-[var(--primary)] hover:bg-white/90 hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_1px_0_0_rgba(0,0,0,0.1)_inset,0_4px_40px_0_rgba(255,255,255,0.2)] transition-all"
                >
                  Sou Dono de Negocio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=CLIENT">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-white/15 text-white border-2 border-white/30 hover:bg-white/25 hover:-translate-y-0.5 active:scale-[0.98] backdrop-blur transition-all"
                >
                  Sou Cliente
                </Button>
              </Link>
            </div>
          </FadeInView>

          <FadeInView delay={0.65}>
            <p className="relative mt-6 text-sm opacity-70">
              Sem cartao de credito. Sem compromisso. Cancele quando quiser.
            </p>
          </FadeInView>
        </div>
      </FadeInView>
    </section>
  );
}
