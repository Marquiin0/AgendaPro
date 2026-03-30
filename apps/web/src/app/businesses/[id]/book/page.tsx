'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, User, Scissors, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: string;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
}

interface Business {
  id: string;
  name: string;
  category: { name: string; slug: string };
  services: Service[];
  staff: Staff[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');

  const { data: business } = useQuery<Business>({
    queryKey: ['business', id],
    queryFn: () => api(`/businesses/${id}`),
    enabled: !!id,
  });

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.durationMin, 0),
    [selectedServices],
  );
  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0),
    [selectedServices],
  );

  const { data: availableSlots, isLoading: slotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ['availability', selectedStaff?.id, totalDuration, selectedDate],
    queryFn: () =>
      api(
        `/availability?staffId=${selectedStaff?.id}&duration=${totalDuration}&date=${selectedDate}`,
      ),
    enabled: !!selectedStaff?.id && totalDuration > 0 && !!selectedDate,
  });

  const bookMutation = useMutation({
    mutationFn: () =>
      api('/appointments', {
        method: 'POST',
        token,
        body: JSON.stringify({
          serviceIds: selectedServices.map((s) => s.id),
          staffId: selectedStaff?.id,
          startTime: `${selectedDate}T${selectedSlot?.startTime}:00`,
          notes: notes || undefined,
        }),
      }),
    onSuccess: () => setStep(6),
  });

  function toggleService(service: Service) {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
    setSelectedSlot(null);
  }

  function isServiceSelected(serviceId: string) {
    return selectedServices.some((s) => s.id === serviceId);
  }

  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  function formatDateLong(dateStr: string) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  const steps = [
    { num: 1, label: 'Servicos', icon: Scissors },
    { num: 2, label: 'Profissional', icon: User },
    { num: 3, label: 'Data', icon: Calendar },
    { num: 4, label: 'Horario', icon: Clock },
    { num: 5, label: 'Confirmar', icon: Check },
  ];

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Faca login para agendar</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Voce precisa estar logado para fazer um agendamento.</p>
        <Button className="mt-4" onClick={() => router.push('/login')}>Fazer Login</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
      </Button>

      <h1 className="text-2xl font-bold mb-1">Agendar em {business?.name}</h1>
      {business?.category && (
        <p className="text-sm text-[var(--muted-foreground)] mb-6">{business.category.name}</p>
      )}

      {/* Step indicator */}
      {step <= 5 && (
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap',
                step >= s.num
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
              )}
            >
              <s.icon className="h-3 w-3" />
              {s.label}
            </div>
          ))}
        </div>
      )}

      {/* ===== STEP 1: SELECT SERVICES (TOGGLE/SWITCH) ===== */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Escolha os servicos</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Selecione um ou mais servicos para agendar
            </p>
          </div>

          <div className="space-y-3">
            {business?.services.map((service) => {
              const selected = isServiceSelected(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all',
                    selected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/40',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-[var(--muted-foreground)] mt-0.5 line-clamp-1">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] mt-1">
                      <Clock className="h-3.5 w-3.5" /> {service.durationMin} min
                    </span>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-lg font-bold text-[var(--primary)] whitespace-nowrap">
                      R$ {parseFloat(service.price).toFixed(2)}
                    </span>
                    {/* Toggle Switch */}
                    <div className={cn(
                      'relative w-12 h-7 rounded-full transition-colors shrink-0',
                      selected ? 'bg-[var(--primary)]' : 'bg-gray-300',
                    )}>
                      <div className={cn(
                        'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform',
                        selected ? 'translate-x-5' : 'translate-x-0.5',
                      )} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          {selectedServices.length > 0 && (
            <div className="sticky bottom-4 mt-6 rounded-2xl border-2 border-[var(--primary)] bg-[var(--background)] p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium">
                    {selectedServices.length} servico{selectedServices.length > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                    <Clock className="h-3.5 w-3.5" /> {totalDuration} min total
                  </span>
                </div>
                <span className="text-xl font-bold text-[var(--primary)]">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedServices.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 text-xs font-medium"
                  >
                    {s.name}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleService(s); }}
                      className="hover:bg-[var(--primary)]/20 rounded-full p-0.5"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ===== STEP 2: SELECT STAFF ===== */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha o profissional</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Quem vai realizar {selectedServices.length > 1 ? 'os servicos' : 'o servico'}?
          </p>
          {business?.staff.map((member) => (
            <div
              key={member.id}
              className={cn(
                'flex items-center gap-4 rounded-2xl border-2 p-4 cursor-pointer transition-all',
                selectedStaff?.id === member.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-[var(--border)] hover:border-[var(--primary)]/40',
              )}
              onClick={() => setSelectedStaff(member)}
            >
              <div className="h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-bold text-lg">
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
              {selectedStaff?.id === member.id && (
                <Check className="ml-auto h-5 w-5 text-[var(--primary)]" />
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button className="flex-1" disabled={!selectedStaff} onClick={() => setStep(3)}>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 3: SELECT DATE ===== */}
      {step === 3 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha a data</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {availableDates.map((date) => {
              const d = new Date(date + 'T12:00:00');
              const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
              const dayNum = d.getDate();
              const monthName = d.toLocaleDateString('pt-BR', { month: 'short' });

              return (
                <button
                  key={date}
                  className={cn(
                    'flex flex-col items-center rounded-2xl border-2 p-3 transition-all cursor-pointer',
                    selectedDate === date
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/40',
                  )}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                >
                  <span className="text-[10px] uppercase font-medium">{dayName}</span>
                  <span className="text-xl font-bold">{dayNum}</span>
                  <span className="text-[10px] uppercase">{monthName}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button className="flex-1" disabled={!selectedDate} onClick={() => setStep(4)}>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 4: SELECT TIME ===== */}
      {step === 4 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha o horario</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatDateLong(selectedDate)} &middot; Duracao: {totalDuration} min
          </p>
          {slotsLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-[var(--muted)]" />
              ))}
            </div>
          ) : availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  className={cn(
                    'rounded-2xl border-2 p-3 text-center transition-all',
                    selectedSlot?.startTime === slot.startTime
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]/40',
                  )}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <span className="text-sm font-bold">{slot.startTime}</span>
                  <span className="block text-[10px] opacity-70">ate {slot.endTime}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
              <p className="text-[var(--muted-foreground)]">
                Nenhum horario disponivel nesta data. Tente outra data.
              </p>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button className="flex-1" disabled={!selectedSlot} onClick={() => setStep(5)}>
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 5: CONFIRM ===== */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirmar Agendamento</h2>
          <Card className="border-2">
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
                  Servicos
                </span>
                <div className="mt-2 space-y-2">
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{s.name}</span>
                        <span className="text-sm text-[var(--muted-foreground)] ml-2">{s.durationMin} min</span>
                      </div>
                      <span className="font-medium">R$ {parseFloat(s.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-[var(--border)]" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Profissional</span>
                  <span className="font-medium">{selectedStaff?.firstName} {selectedStaff?.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Data</span>
                  <span className="font-medium">{formatDateLong(selectedDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Horario</span>
                  <span className="font-medium">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Duracao total</span>
                  <span className="font-medium">{totalDuration} min</span>
                </div>
              </div>
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[var(--primary)]">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observacoes (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="flex w-full rounded-2xl border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
              placeholder="Alguma observacao para o profissional..."
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(4)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button
              className="flex-1"
              onClick={() => bookMutation.mutate()}
              disabled={bookMutation.isPending}
            >
              {bookMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
          {bookMutation.isError && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">
              {(bookMutation.error as Error)?.message || 'Erro ao agendar. Tente novamente.'}
            </div>
          )}
        </div>
      )}

      {/* ===== STEP 6: SUCCESS ===== */}
      {step === 6 && (
        <div className="text-center py-12">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Agendamento Confirmado!</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            {selectedServices.length > 1
              ? `Seus ${selectedServices.length} servicos foram agendados com sucesso.`
              : 'Seu agendamento foi realizado com sucesso.'}
          </p>
          <div className="mt-3 text-sm text-[var(--muted-foreground)]">
            <p>{formatDateLong(selectedDate)}</p>
            <p>{selectedSlot?.startTime} - {selectedSlot?.endTime} com {selectedStaff?.firstName}</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/dashboard')}>Ver Meus Agendamentos</Button>
            <Button variant="outline" onClick={() => router.push('/businesses')}>Explorar Mais Negocios</Button>
          </div>
        </div>
      )}
    </div>
  );
}
