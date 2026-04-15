'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ease, dur, stagger } from '@/lib/motion-config';

export default function SettingsPage() {
  const { data: session } = useSession();

  const infoItems = [
    { label: 'Nome', value: session?.user?.name },
    { label: 'Email', value: session?.user?.email },
    { label: 'Tipo de Conta', value: session?.user?.role === 'ADMIN' ? 'Dono de Negocio' : 'Cliente' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <FadeInView>
        <h1 className="text-3xl font-bold">Configuracoes</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Gerencie suas informacoes de perfil.
        </p>
      </FadeInView>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur.medium, ease: ease.smoothOut, delay: 0.15 }}
        className="mt-8"
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4">
            {/* Animated avatar */}
            <motion.div
              className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-[var(--primary)]/20 shadow-[0_0_20px_rgba(var(--primary-rgb,99_102_241)/0.15)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: dur.base, ease: ease.expo, delay: 0.3 }}
            >
              {session?.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
            </motion.div>
            <div>
              <CardTitle>Informacoes Pessoais</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Suas informacoes de conta</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-0">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center justify-between py-4 border-b border-[var(--border)]/50 last:border-0"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: dur.base, ease: ease.smoothOut, delay: 0.2 + i * stagger.cards }}
              >
                <span className="text-sm text-[var(--muted-foreground)]">{item.label}</span>
                <p className="font-medium text-sm">{item.value || '—'}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
