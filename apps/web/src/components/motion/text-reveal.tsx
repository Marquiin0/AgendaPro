'use client';

import { motion } from 'framer-motion';
import { ease, dur, stagger } from '@/lib/motion-config';

interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  as: Tag = 'h2',
  className,
  delay = 0,
}: TextRevealProps) {
  const MotionTag = motion.create(Tag);

  // Split text into lines by explicit \n or treat as single line
  const lines = children.split('\n').filter(Boolean);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: { y: '110%' },
              visible: {
                y: '0%',
                transition: {
                  duration: dur.reveal,
                  ease: ease.sharpSnap,
                  delay: delay + i * stagger.lines,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
