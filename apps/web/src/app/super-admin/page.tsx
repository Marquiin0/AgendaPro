'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Store, Calendar, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Stats {
  totalUsers: number;
  totalBusinesses: number;
  totalAppointments: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newBusinessesThisMonth: number;
  appointmentsByStatus: Record<string, number>;
}

interface TimelineData {
  users: { month: string; count: number }[];
  businesses: { month: string; count: number }[];
  appointments: { month: string; count: number }[];
  revenue: { month: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#22c55e',
  COMPLETED: '#3b82f6',
  CANCELLED: '#ef4444',
  NO_SHOW: '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Nao compareceu',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(m) - 1]}/${year.slice(2)}`;
}

export default function SuperAdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    const headers = { Authorization: `Bearer ${session.user.accessToken}` };

    Promise.all([
      fetch(`${API_URL}/super-admin/stats`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/super-admin/stats/timeline`, { headers }).then((r) => r.json()),
    ])
      .then(([statsData, timelineData]) => {
        setStats(statsData);
        setTimeline(timelineData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-[var(--muted)] rounded animate-pulse mb-3" />
                <div className="h-8 w-16 bg-[var(--muted)] rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-64 bg-[var(--muted)] rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total de Usuarios', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: `+${stats?.newUsersThisMonth || 0} este mes` },
    { label: 'Total de Negocios', value: stats?.totalBusinesses || 0, icon: Store, color: 'text-green-500', bg: 'bg-green-500/10', sub: `+${stats?.newBusinessesThisMonth || 0} este mes` },
    { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: '' },
    { label: 'Receita Total', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'servicos concluidos' },
  ];

  const pieData = stats?.appointmentsByStatus
    ? Object.entries(stats.appointmentsByStatus).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        color: STATUS_COLORS[status] || '#6b7280',
      }))
    : [];

  const registrationData = timeline?.users.map((u, i) => ({
    month: formatMonth(u.month),
    usuarios: u.count,
    negocios: timeline.businesses[i]?.count || 0,
  })) || [];

  const appointmentData = timeline?.appointments.map((a) => ({
    month: formatMonth(a.month),
    agendamentos: a.count,
  })) || [];

  const revenueData = timeline?.revenue.map((r) => ({
    month: formatMonth(r.month),
    receita: r.value,
  })) || [];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard da Plataforma</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Visao geral de tudo que acontece no AgendaPro.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">{kpi.label}</span>
                <div className={`h-10 w-10 rounded-full ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{typeof kpi.value === 'number' ? kpi.value.toLocaleString('pt-BR') : kpi.value}</p>
              {kpi.sub && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  {kpi.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Cadastros por mes */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-[var(--primary)]" />
              <h3 className="font-semibold">Cadastros por Mes</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Usuarios" />
                  <Line type="monotone" dataKey="negocios" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Negocios" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Agendamentos por mes */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Agendamentos por Mes</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="agendamentos" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Agendamentos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status dos agendamentos */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Agendamentos por Status</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[var(--muted-foreground)] text-sm">Nenhum agendamento ainda</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Receita mensal */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Receita Mensal</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--foreground)' }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                  />
                  <Area type="monotone" dataKey="receita" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} name="Receita" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
