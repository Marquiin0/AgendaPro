'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, User, Scissors } from 'lucide-react';
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState('');

  const { data: business } = useQuery<Business>({
    queryKey: ['business', id],
    queryFn: () => api(`/businesses/${id}`),
    enabled: !!id,
  });

  const { data: availableSlots, isLoading: slotsLoading } = useQuery<TimeSlot[]>({
    queryKey: ['availability', selectedStaff?.id, selectedService?.id, selectedDate],
    queryFn: () =>
      api(
        `/availability?staffId=${selectedStaff?.id}&serviceId=${selectedService?.id}&date=${selectedDate}`,
      ),
    enabled: !!selectedStaff?.id && !!selectedService?.id && !!selectedDate,
  });

  const bookMutation = useMutation({
    mutationFn: () =>
      api('/appointments', {
        method: 'POST',
        token,
        body: JSON.stringify({
          serviceId: selectedService?.id,
          staffId: selectedStaff?.id,
          startTime: `${selectedDate}T${selectedSlot?.startTime}:00`,
          notes: notes || undefined,
        }),
      }),
    onSuccess: () => setStep(6),
  });

  // Generate next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  const steps = [
    { num: 1, label: 'Servico', icon: Scissors },
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
        <Button className="mt-4" onClick={() => router.push('/login')}>
          Fazer Login
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <h1 className="text-2xl font-bold mb-2">Agendar em {business?.name}</h1>

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

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha o servico</h2>
          {business?.services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                'cursor-pointer transition-all',
                selectedService?.id === service.id && 'ring-2 ring-[var(--primary)]',
              )}
              onClick={() => setSelectedService(service)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {service.durationMin} min
                  </p>
                </div>
                <span className="font-bold text-[var(--primary)]">
                  R$ {parseFloat(service.price).toFixed(2)}
                </span>
              </CardContent>
            </Card>
          ))}
          <Button
            className="w-full mt-4"
            disabled={!selectedService}
            onClick={() => setStep(2)}
          >
            Proximo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Select Staff */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha o profissional</h2>
          {business?.staff.map((member) => (
            <Card
              key={member.id}
              className={cn(
                'cursor-pointer transition-all',
                selectedStaff?.id === member.id && 'ring-2 ring-[var(--primary)]',
              )}
              onClick={() => setSelectedStaff(member)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] font-medium">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <span className="font-medium">{member.firstName} {member.lastName}</span>
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button className="flex-1" disabled={!selectedStaff} onClick={() => setStep(3)}>
              Proximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date */}
      {step === 3 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha a data</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {availableDates.map((date) => (
              <button
                key={date}
                className={cn(
                  'rounded-lg border p-2 text-center text-sm transition-all',
                  selectedDate === date
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'border-[var(--border)] hover:border-[var(--primary)]',
                )}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button className="flex-1" disabled={!selectedDate} onClick={() => setStep(4)}>
              Proximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Select Time */}
      {step === 4 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Escolha o horario</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Data selecionada: {formatDate(selectedDate)}
          </p>
          {slotsLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-[var(--muted)]" />
              ))}
            </div>
          ) : availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  className={cn(
                    'rounded-lg border p-2 text-center text-sm font-medium transition-all',
                    selectedSlot?.startTime === slot.startTime
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'border-[var(--border)] hover:border-[var(--primary)]',
                  )}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--border)] p-6 text-center">
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
              Proximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirmar Agendamento</h2>
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Servico</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Profissional</span>
                <span className="font-medium">
                  {selectedStaff?.firstName} {selectedStaff?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Data</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Horario</span>
                <span className="font-medium">
                  {selectedSlot?.startTime} - {selectedSlot?.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Duracao</span>
                <span className="font-medium">{selectedService?.durationMin} min</span>
              </div>
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-[var(--primary)]">
                  R$ {selectedService ? parseFloat(selectedService.price).toFixed(2) : '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium">Observacoes (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="flex w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
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
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {(bookMutation.error as Error)?.message || 'Erro ao agendar. Tente novamente.'}
            </div>
          )}
        </div>
      )}

      {/* Step 6: Success */}
      {step === 6 && (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Agendamento Confirmado!</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Seu agendamento foi realizado com sucesso.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Ver Meus Agendamentos
            </Button>
            <Button variant="outline" onClick={() => router.push('/businesses')}>
              Explorar Mais Negocios
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
