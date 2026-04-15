'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CounterAnimated } from '@/components/motion/counter-animated';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ease, dur, spring } from '@/lib/motion-config';
import { useRef } from 'react';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax for background orbs
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Mouse-follow for mockup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mockupX = useSpring(mouseX, spring.gentle);
  const mockupY = useSpring(mouseY, spring.gentle);

  function handleMouseMove(e: React.MouseEvent) {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * -0.015);
    mouseY.set((e.clientY - centerY) * -0.015);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden"
    >
      {/* Animated parallax background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: orbY1 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/[0.07] blur-[100px]"
        />
        <motion.div
          style={{ y: orbY2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-400/[0.05] blur-[80px]"
        />
        <motion.div
          style={{ y: orbY3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-400/[0.04] blur-[60px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            {/* Badge pill — frosted glass */}
            <FadeInView delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 backdrop-blur-sm border border-[var(--primary)]/20 px-4 py-1.5 text-sm font-medium text-[var(--primary)] mb-6">
                <Sparkles className="h-4 w-4" />
                Plataforma de Agendamento #1
              </div>
            </FadeInView>

            {/* Headline — line-mask reveal */}
            <TextReveal
              as="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
              delay={0.15}
            >
              {`Seu negocio sempre lotado.\nSem esforco.`}
            </TextReveal>

            <FadeInView delay={0.4}>
              <p className="mt-6 text-lg sm:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0">
                A plataforma completa de agendamento online para barbearias, clinicas,
                estudios e muito mais. Seus clientes agendam 24/7 enquanto voce foca no que importa.
              </p>
            </FadeInView>

            {/* CTA buttons — heat-halo primary */}
            <FadeInView delay={0.55}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link href="/register?role=ADMIN">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_0_rgba(var(--primary-rgb,99_102_241)/0.3),0_4px_20px_0_rgba(var(--primary-rgb,99_102_241)/0.2),0_8px_60px_0_rgba(var(--primary-rgb,99_102_241)/0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_2px_8px_0_rgba(var(--primary-rgb,99_102_241)/0.4),0_4px_20px_0_rgba(var(--primary-rgb,99_102_241)/0.3),0_8px_60px_0_rgba(var(--primary-rgb,99_102_241)/0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    Comece Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base h-14 px-8 rounded-full hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    Veja como funciona
                  </Button>
                </a>
              </div>
            </FadeInView>

            {/* Stats — animated counters */}
            <FadeInView delay={0.7}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">
                    <CounterAnimated target={500} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">Negocios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold">
                    <CounterAnimated target={10000} suffix="+" />
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">Agendamentos</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold">
                    4.9 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">Avaliacao</div>
                </div>
              </div>
            </FadeInView>
          </div>

          {/* Hero Visual — mockup with mouse-follow + clipPath entrance */}
          <motion.div
            ref={mockupRef}
            className="flex-1 w-full max-w-lg lg:max-w-xl"
            initial={{ clipPath: 'inset(8% round 20px)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% round 16px)', opacity: 1 }}
            transition={{ duration: 1.2, ease: ease.smoothOut, delay: 0.3 }}
          >
            <motion.div
              style={{ x: mockupX, y: mockupY }}
              className="relative"
            >
              <Image
                src="/images/MockupAgendaPro.png"
                alt="AgendaPro - Painel Administrativo e App Mobile"
                width={1400}
                height={900}
                className="rounded-2xl drop-shadow-2xl"
                priority
              />
              {/* Glow behind mockup */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[var(--primary)]/10 blur-2xl -z-10"
                animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
