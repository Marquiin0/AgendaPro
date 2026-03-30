'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  schedules: Schedule[];
}

interface Business {
  id: string;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Segunda',
  TUESDAY: 'Terca',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sabado',
  SUNDAY: 'Domingo',
};

export default function StaffPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;

  const { data: business } = useQuery<Business>({
    queryKey: ['my-business'],
    queryFn: () => api('/businesses/mine', { token }),
    enabled: !!token,
  });

  const { data: staffList, isLoading } = useQuery<Staff[]>({
    queryKey: ['staff', business?.id],
    queryFn: () => api(`/businesses/${business?.id}/staff`, { token }),
    enabled: !!business?.id,
  });

  const [showForm, setShowForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [scheduleForm, setScheduleForm] = useState<Record<string, { startTime: string; endTime: string; isActive: boolean }>>({});

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api(`/businesses/${business?.id}/staff`, { method: 'POST', token, body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/businesses/${business?.id}/staff/${id}`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const scheduleMutation = useMutation({
    mutationFn: ({ staffId, schedules }: { staffId: string; schedules: any[] }) =>
      api(`/businesses/${business?.id}/staff/${staffId}/schedules`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ schedules }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowSchedule(null);
    },
  });

  function openSchedule(staff: Staff) {
    const schedMap: Record<string, { startTime: string; endTime: string; isActive: boolean }> = {};
    DAYS.forEach((day) => {
      const existing = staff.schedules.find((s) => s.dayOfWeek === day);
      schedMap[day] = existing
        ? { startTime: existing.startTime, endTime: existing.endTime, isActive: existing.isActive }
        : { startTime: '09:00', endTime: '18:00', isActive: false };
    });
    setScheduleForm(schedMap);
    setShowSchedule(staff.id);
  }

  function saveSchedule(staffId: string) {
    const schedules = DAYS
      .filter((day) => scheduleForm[day]?.isActive)
      .map((day) => ({
        dayOfWeek: day,
        startTime: scheduleForm[day].startTime,
        endTime: scheduleForm[day].endTime,
        isActive: true,
      }));
    scheduleMutation.mutate({ staffId, schedules });
  }

  if (!business) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--muted-foreground)]">Configure seu negocio primeiro.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipe</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Profissional
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(form);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Sobrenome</Label>
                  <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>Adicionar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-[var(--muted)]" />)}
        </div>
      ) : staffList && staffList.length > 0 ? (
        <div className="space-y-3">
          {staffList.map((staff) => (
            <div key={staff.id}>
              <Card>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3">
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-[var(--primary)]" />
                    <div>
                      <h3 className="font-medium">{staff.firstName} {staff.lastName}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {staff.schedules.filter((s) => s.isActive).length} dias na semana
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openSchedule(staff)}>
                      <Clock className="h-4 w-4 mr-1" />
                      Horarios
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(staff.id)}>
                      <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showSchedule === staff.id && (
                <Card className="mt-2 ml-0 sm:ml-8">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Horarios - {staff.firstName} {staff.lastName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DAYS.map((day) => (
                      <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 w-28">
                          <input
                            type="checkbox"
                            checked={scheduleForm[day]?.isActive || false}
                            onChange={(e) =>
                              setScheduleForm((p) => ({
                                ...p,
                                [day]: { ...p[day], isActive: e.target.checked },
                              }))
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
                        </div>
                        {scheduleForm[day]?.isActive && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={scheduleForm[day]?.startTime || '09:00'}
                              onChange={(e) =>
                                setScheduleForm((p) => ({
                                  ...p,
                                  [day]: { ...p[day], startTime: e.target.value },
                                }))
                              }
                              className="w-32"
                            />
                            <span className="text-sm">ate</span>
                            <Input
                              type="time"
                              value={scheduleForm[day]?.endTime || '18:00'}
                              onChange={(e) =>
                                setScheduleForm((p) => ({
                                  ...p,
                                  [day]: { ...p[day], endTime: e.target.value },
                                }))
                              }
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => saveSchedule(staff.id)} disabled={scheduleMutation.isPending}>
                        Salvar Horarios
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowSchedule(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <h3 className="mt-4 text-lg font-medium">Nenhum profissional</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Adicione membros da sua equipe.
          </p>
        </div>
      )}
    </div>
  );
}
