'use client';

import { motion } from 'framer-motion';
import { ease, dur } from '@/lib/motion-config';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function FadeInView({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 24,
}: FadeInViewProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: dur.medium, ease: ease.smoothOut, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
