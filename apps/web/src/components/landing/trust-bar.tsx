'use client';

import {
  Scissors, Stethoscope, Camera, Briefcase, Dumbbell, Sparkles,
} from 'lucide-react';
import { categories } from '@/data/landing-data';

const iconMap: Record<string, React.ElementType> = {
  Scissors, Stethoscope, Camera, Briefcase, Dumbbell, Sparkles,
};

function CategoryItem({ icon, label }: { icon: string; label: string }) {
  const Icon = iconMap[icon];
  return (
    <div className="flex flex-col items-center gap-2 group cursor-default shrink-0 px-4">
      <div className="h-12 w-12 rounded-full bg-[var(--background)]/80 backdrop-blur border border-[var(--border)]/60 flex items-center justify-center group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb,99_102_241)/0.15)] transition-all duration-300">
        <Icon className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
      </div>
      <span className="text-xs font-medium text-[var(--muted-foreground)] whitespace-nowrap">{label}</span>
    </div>
  );
}

export function TrustBar() {
  // Triple the items for seamless infinite scroll
  const items = [...categories, ...categories, ...categories];

  return (
    <section className="border-y border-[var(--border)]/40 bg-[var(--muted)]/30 py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-medium text-[var(--muted-foreground)] mb-6 uppercase tracking-widest">
          Ideal para todos os tipos de negocio
        </p>
      </div>

      {/* Infinite marquee with edge masks */}
      <div
        className="relative group"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="flex animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused]">
          {items.map((cat, i) => (
            <CategoryItem key={`${cat.label}-${i}`} icon={cat.icon} label={cat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
