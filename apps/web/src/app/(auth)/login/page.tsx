'use client';

import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { ease } from '@/lib/motion-config';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-blue-600 items-center justify-center p-12">
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white/5 blur-2xl"
          animate={{ x: [0, -25, 20, 0], y: [0, 15, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        {/* Noise */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <filter id="loginNoise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#loginNoise)" />
        </svg>

        <motion.div
          className="relative text-white text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.smoothOut }}
        >
          <Calendar className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta</h2>
          <p className="text-lg opacity-80">
            Acesse sua conta e gerencie seus agendamentos de forma simples e rapida.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-60">
            <Sparkles className="h-4 w-4" />
            <span>Mais de 500 negocios confiam no AgendaPro</span>
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Mobile gradient banner */}
        <div className="lg:hidden absolute top-16 left-0 right-0 h-32 bg-gradient-to-b from-[var(--primary)]/10 to-transparent -z-10" />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.smoothOut, delay: 0.1 }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
