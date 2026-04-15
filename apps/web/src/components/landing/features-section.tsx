'use client';

import {
  CalendarDays, ToggleRight, Users, LayoutDashboard, ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CursorSpotlight } from '@/components/motion/cursor-spotlight';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, staggerItem } from '@/components/motion/stagger-children';
import { features } from '@/data/landing-data';
import { spring } from '@/lib/motion-config';

const iconMap: Record<string, React.ElementType> = {
  CalendarDays, ToggleRight, Users, LayoutDashboard, ShieldCheck,
};

export function FeaturesSection() {
  return (
    <section className="relative px-4 py-20 bg-[var(--muted)]/30 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, blue 0%, transparent 50%)',
        }}
      />

      <div className="mx-auto max-w-7xl">
        <FadeInView className="text-center mb-16">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Funcionalidades</p>
          <TextReveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Tudo que seu negocio precisa
          </TextReveal>
        </FadeInView>

        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div key={feature.title} variants={staggerItem}>
                <CursorSpotlight className="h-full rounded-2xl bg-[var(--card)]/60 backdrop-blur-xl border border-[var(--border)]/30 hover:border-[var(--primary)]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default group">
                  <div className="p-6">
                    <motion.div
                      className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:scale-110 transition-all duration-300"
                      whileHover={{ rotate: 5, scale: 1.1, transition: spring.gentle }}
                    >
                      <Icon className="h-6 w-6 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors" />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{feature.desc}</p>
                  </div>
                </CursorSpotlight>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
