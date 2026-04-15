'use client';

import { Store, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/motion/tilt-card';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, staggerItem } from '@/components/motion/stagger-children';
import { steps } from '@/data/landing-data';
import { ease, dur } from '@/lib/motion-config';

const iconMap: Record<string, React.ElementType> = { Store, Clock, Calendar };

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative px-4 py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--primary)]/[0.03] blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <FadeInView className="text-center mb-16">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Simples e rapido</p>
          <TextReveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Como funciona
          </TextReveal>
          <p className="mt-4 text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Em 3 passos simples, seu negocio estara recebendo agendamentos online.
          </p>
        </FadeInView>

        <StaggerChildren className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div key={step.num} variants={staggerItem}>
                <TiltCard className="relative text-center group">
                  <div className="rounded-2xl bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)]/40 p-8 hover:border-[var(--primary)]/30 transition-all duration-300">
                    {/* Step number — animates in */}
                    <motion.div
                      className="text-7xl font-black text-[var(--primary)]/[0.07] mb-4 select-none"
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: dur.medium, ease: ease.expo, delay: i * 0.1 }}
                      style={{ transformOrigin: 'center bottom' }}
                    >
                      {step.num}
                    </motion.div>

                    <motion.div
                      className="mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/25"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: dur.base, ease: ease.expo, delay: 0.2 + i * 0.1 }}
                    >
                      <Icon className="h-7 w-7 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                    </motion.div>

                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm max-w-xs mx-auto">{step.desc}</p>
                  </div>

                  {/* Connection dashed line between steps */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 -translate-y-1/2">
                      <motion.svg
                        width="32"
                        height="2"
                        viewBox="0 0 32 2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: dur.slow, delay: 0.5 + i * 0.2 }}
                      >
                        <motion.line
                          x1="0" y1="1" x2="32" y2="1"
                          stroke="var(--primary)"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          strokeOpacity="0.3"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: dur.slow, delay: 0.5 + i * 0.2 }}
                        />
                      </motion.svg>
                    </div>
                  )}
                </TiltCard>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
