'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';

interface CounterAnimatedProps {
  target: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function CounterAnimated({
  target,
  suffix = '',
  className,
  duration = 1.5,
}: CounterAnimatedProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 30,
    duration,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Math.round(latest).toLocaleString('pt-BR') + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, suffix]);

  return <motion.span ref={ref} className={className}>0{suffix}</motion.span>;
}
