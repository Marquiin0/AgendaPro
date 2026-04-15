'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';
import { ease } from '@/lib/motion-config';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-blue-600 items-center justify-center p-12">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 20, -15, 0], y: [0, -25, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-white/5 blur-2xl"
          animate={{ x: [0, -20, 25, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <filter id="regNoise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#regNoise)" />
        </svg>

        <motion.div
          className="relative text-white text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.smoothOut }}
        >
          <Calendar className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Comece gratis</h2>
          <p className="text-lg opacity-80 mb-8">
            Crie sua conta em menos de 2 minutos e transforme seu negocio.
          </p>
          <div className="space-y-3 text-left">
            {['Agendamento online 24/7', 'Gestao completa da equipe', 'Sem cartao de credito'].map((item, i) => (
              <motion.div
                key={item}
                className="flex items-center gap-3 text-sm opacity-80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.8, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="lg:hidden absolute top-16 left-0 right-0 h-32 bg-gradient-to-b from-[var(--primary)]/10 to-transparent -z-10" />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.smoothOut, delay: 0.1 }}
        >
          <Suspense>
            <RegisterForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
