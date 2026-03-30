'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { maskPhone, maskCep, maskState, unmaskDigits } from '@/lib/masks';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Business {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  categoryId: string;
  category: Category;
}

export default function BusinessPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;

  const { data: business, isLoading } = useQuery<Business>({
    queryKey: ['my-business'],
    queryFn: () => api('/businesses/mine', { token }),
    enabled: !!token,
    retry: false,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api('/categories'),
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    categoryId: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || '',
        description: business.description || '',
        phone: business.phone ? maskPhone(business.phone) : '',
        email: business.email || '',
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        zipCode: business.zipCode ? maskCep(business.zipCode) : '',
        categoryId: business.categoryId || '',
      });
    }
  }, [business]);

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api('/businesses', {
        method: 'POST',
        token,
        body: JSON.stringify({
          ...data,
          phone: unmaskDigits(data.phone) || undefined,
          zipCode: unmaskDigits(data.zipCode) || undefined,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      setSuccessMsg('Negócio criado com sucesso!');
      setErrorMsg('');
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Erro ao criar negócio');
      setSuccessMsg('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api(`/businesses/${business?.id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({
          ...data,
          phone: unmaskDigits(data.phone) || undefined,
          zipCode: unmaskDigits(data.zipCode) || undefined,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      setSuccessMsg('Alterações salvas com sucesso!');
      setErrorMsg('');
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Erro ao salvar alterações');
      setSuccessMsg('');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!form.categoryId) {
      setErrorMsg('Selecione uma categoria');
      return;
    }
    if (!form.name.trim()) {
      setErrorMsg('Nome do negócio é obrigatório');
      return;
    }

    if (business) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: maskPhone(e.target.value) }));
  }

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, zipCode: maskCep(e.target.value) }));
  }

  function handleStateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, state: maskState(e.target.value) }));
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {business ? 'Editar Negócio' : 'Configurar Negócio'}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{business ? 'Informações do Negócio' : 'Criar Seu Negócio'}</CardTitle>
        </CardHeader>
        <CardContent>
          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-500 mb-4">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500 mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-full border border-[var(--input)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ring-offset-[var(--background)]"
              >
                <option value="">Selecione uma categoria</option>
                {categoriesLoading && <option disabled>Carregando...</option>}
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Negócio</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Ex: Barbearia do João" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva seu negócio..."
                className="flex w-full rounded-2xl border border-[var(--input)] bg-[var(--background)]/80 backdrop-blur-sm px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ring-offset-[var(--background)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="contato@negocio.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Rua, número, bairro" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" name="state" value={form.state} onChange={handleStateChange} placeholder="SP" maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Salvando...'
                : business
                  ? 'Salvar Alterações'
                  : 'Criar Negócio'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
