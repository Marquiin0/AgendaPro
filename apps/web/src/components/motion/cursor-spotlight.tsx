'use client';

import { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface CursorSpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  opacity?: number;
}

export function CursorSpotlight({
  children,
  className,
  size = 300,
  opacity = 0.08,
}: CursorSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(-size);
    mouseY.set(-size);
  }

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className || ''}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{
          background: `radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, rgba(var(--primary-rgb, 99 102 241) / ${opacity}), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
