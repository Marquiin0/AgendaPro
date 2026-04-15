'use client';

import { motion } from 'framer-motion';
import { ease, dur, stagger } from '@/lib/motion-config';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  type?: 'chars' | 'words';
}

export function SplitText({
  children,
  className,
  delay = 0,
  type = 'words',
}: SplitTextProps) {
  const items = type === 'chars' ? children.split('') : children.split(' ');
  const staggerValue = type === 'chars' ? stagger.chars : stagger.lines;

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {items.map((item, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: dur.medium,
                  ease: ease.expo,
                  delay: delay + i * staggerValue,
                },
              },
            }}
          >
            {item}
            {type === 'words' && i < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
