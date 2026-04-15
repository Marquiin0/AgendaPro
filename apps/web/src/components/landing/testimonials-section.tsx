'use client';

import { Star } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TextReveal } from '@/components/motion/text-reveal';
import { FadeInView } from '@/components/motion/fade-in-view';
import { StaggerChildren, staggerItem } from '@/components/motion/stagger-children';
import { testimonials } from '@/data/landing-data';
import { spring } from '@/lib/motion-config';
import { useState, useRef } from 'react';

function StarRating({ rating, delay = 0 }: { rating: number; delay?: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, j) => (
        <motion.div
          key={j}
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring.bouncy, delay: delay + j * 0.05 }}
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </motion.div>
      ))}
    </div>
  );
}

function MobileCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);

  return (
    <div className="md:hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -(testimonials.length - 1) * 300, right: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 28 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          const offset = info.offset.x;
          if (Math.abs(offset) > 80) {
            const direction = offset > 0 ? -1 : 1;
            const newIndex = Math.max(0, Math.min(testimonials.length - 1, activeIndex + direction));
            setActiveIndex(newIndex);
            animate(x, -newIndex * 300, { type: 'spring', stiffness: 260, damping: 28 });
          }
        }}
      >
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name} testimonial={t} index={i} />
        ))}
      </motion.div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]'}`}
            onClick={() => {
              setActiveIndex(i);
              animate(x, -i * 300, { type: 'spring', stiffness: 260, damping: 28 });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial: t, index }: { testimonial: typeof testimonials[number]; index: number }) {
  return (
    <Card className="h-full min-w-[280px] border-0 bg-[var(--card)]/60 backdrop-blur-xl border border-[var(--border)]/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1 relative">
        {/* Decorative quote mark */}
        <span className="absolute -top-1 left-4 text-5xl font-serif text-[var(--primary)]/20 select-none leading-none">
          &ldquo;
        </span>
        <StarRating rating={t.rating} delay={index * 0.1} />
        <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed italic flex-1">
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="flex items-center gap-3 mt-auto">
          <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-sm shrink-0 ring-2 ring-[var(--primary)]/20 shadow-[0_0_15px_rgba(var(--primary-rgb,99_102_241)/0.1)]">
            {t.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-sm">{t.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{t.role}, {t.business}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative px-4 py-20 sm:py-28 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-400/[0.03] blur-[80px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <FadeInView className="text-center mb-16">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">Depoimentos</p>
          <TextReveal as="h2" className="text-3xl sm:text-4xl font-bold">
            O que nossos clientes dizem
          </TextReveal>
        </FadeInView>

        {/* Desktop grid */}
        <StaggerChildren className="hidden md:grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} variants={staggerItem}>
              <TestimonialCard testimonial={t} index={i} />
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Mobile carousel */}
        <MobileCarousel />
      </div>
    </section>
  );
}
