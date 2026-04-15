'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Scissors, Stethoscope, Camera, Briefcase, Dumbbell, Sparkles, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TiltCard } from '@/components/motion/tilt-card';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, staggerItem } from '@/components/motion/stagger-children';
import { industries } from '@/data/landing-data';
import { spring } from '@/lib/motion-config';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Scissors, Stethoscope, Camera, Briefcase, Dumbbell, Sparkles,
};

export function IndustriesSection() {
  return (
    <section className="relative px-4 py-20 bg-[var(--muted)]/30 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full bg-blue-400/[0.03] blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <FadeInView className="text-center mb-16">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Para todos os segmentos</p>
          <TextReveal as="h2" className="text-3xl sm:text-4xl font-bold">
            Feito para o seu tipo de negocio
          </TextReveal>
        </FadeInView>

        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {industries.map((ind) => {
            const Icon = iconMap[ind.icon];
            return (
              <motion.div key={ind.title} variants={staggerItem} className="h-full">
                <TiltCard className="h-full" maxTilt={4}>
                  <Card className="h-full border-0 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    {/* Image with shine sweep on hover */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={ind.image}
                        alt={ind.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:saturate-100 group-hover:brightness-100 saturate-[0.9] brightness-[0.95]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* Shine sweep overlay */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <motion.div
                        className={cn(
                          'h-10 w-10 rounded-full bg-gradient-to-r flex items-center justify-center mb-3 text-white -mt-10 relative z-10 ring-4 ring-[var(--card)] group-hover:scale-110 transition-transform duration-300',
                          ind.color,
                        )}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={spring.bouncy}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <h3 className="text-lg font-bold mb-2">{ind.title}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">{ind.desc}</p>
                      <Link
                        href="/register?role=ADMIN"
                        className="inline-flex items-center text-sm font-medium text-[var(--primary)] group-hover:translate-x-1 transition-transform mt-auto"
                      >
                        Comece agora <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
