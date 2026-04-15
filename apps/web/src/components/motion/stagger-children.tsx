'use client';

import { motion } from 'framer-motion';
import { ease, dur, stagger as staggerTokens } from '@/lib/motion-config';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

const container = (staggerDelay: number, initialDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.medium, ease: ease.smoothOut },
  },
};

export function StaggerChildren({
  children,
  className,
  stagger = staggerTokens.cards,
  delay = 0,
}: StaggerChildrenProps) {
  return (
    <motion.div
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
