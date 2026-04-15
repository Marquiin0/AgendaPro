'use client';

import { useSession } from 'next-auth/react';
import { Store, Users, Calendar, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInView } from '@/components/motion/fade-in-view';
import { ease, dur, stagger } from '@/lib/motion-config';

const stats = [
  { title: 'Agendamentos Hoje', value: '0', icon: Calendar, borderColor: 'border-t-[var(--primary)]' },
  { title: 'Servicos Ativos', value: '0', icon: Scissors, borderColor: 'border-t-green-500' },
  { title: 'Equipe', value: '0', icon: Users, borderColor: 'border-t-blue-500' },
  { title: 'Negocio', value: 'Configurar', icon: Store, borderColor: 'border-t-orange-500' },
];

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <FadeInView>
        <h1 className="text-3xl font-bold">
          Painel Administrativo
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Ola, {session?.user?.firstName}! Gerencie seu negocio aqui.
        </p>
      </FadeInView>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.medium, ease: ease.smoothOut, delay: i * stagger.cards }}
          >
            <Card className={`border-t-2 ${stat.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
