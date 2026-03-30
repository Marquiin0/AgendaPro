'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Scissors, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: string;
  isActive: boolean;
}

interface Business {
  id: string;
  name: string;
}

const emptyForm = { name: '', description: '', durationMin: 30, price: 0 };

export default function ServicesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;

  const { data: business } = useQuery<Business>({
    queryKey: ['my-business'],
    queryFn: () => api('/businesses/mine', { token }),
    enabled: !!token,
  });

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['services', business?.id],
    queryFn: () => api(`/businesses/${business?.id}/services`, { token }),
    enabled: !!business?.id,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api(`/businesses/${business?.id}/services`, {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      api(`/businesses/${business?.id}/services/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/businesses/${business?.id}/services/${id}`, {
        method: 'DELETE',
        token,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || '',
      durationMin: service.durationMin,
      price: parseFloat(service.price),
    });
    setShowForm(true);
  }

  if (!business) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--muted-foreground)]">
          Configure seu negocio primeiro antes de adicionar servicos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Servicos</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Servico
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Servico' : 'Novo Servico'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="durationMin">Duracao (minutos)</Label>
                  <Input
                    id="durationMin"
                    type="number"
                    min={5}
                    value={form.durationMin}
                    onChange={(e) => setForm((p) => ({ ...p, durationMin: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preco (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Salvar' : 'Criar Servico'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--muted)]" />
          ))}
        </div>
      ) : services && services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Scissors className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {service.durationMin}min - R$ {parseFloat(service.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
          <Scissors className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <h3 className="mt-4 text-lg font-medium">Nenhum servico ainda</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Adicione servicos para que clientes possam agendar.
          </p>
        </div>
      )}
    </div>
  );
}
