'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Search, MapPin, Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  state: string | null;
  category: Category;
  _count: { services: number; staff: number };
}

export default function BusinessesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api('/categories'),
  });

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ['businesses', search, selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      return api(`/businesses?${params.toString()}`);
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Explorar Negocios</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Encontre o servico ideal para voce.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex h-10 rounded-2xl border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
        >
          <option value="">Todas categorias</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((biz) => (
              <Link key={biz.id} href={`/businesses/${biz.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-[var(--primary)] font-medium mb-1">
                      <Store className="h-3 w-3" />
                      {biz.category.name}
                    </div>
                    <CardTitle className="text-lg">{biz.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {biz.description && (
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                        {biz.description}
                      </p>
                    )}
                    {biz.city && (
                      <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                        <MapPin className="h-3 w-3" />
                        {biz.city}{biz.state ? `, ${biz.state}` : ''}
                      </div>
                    )}
                    <div className="mt-3 flex gap-4 text-xs text-[var(--muted-foreground)]">
                      <span>{biz._count.services} servicos</span>
                      <span>{biz._count.staff} profissionais</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] p-12 text-center">
            <Store className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
            <h3 className="mt-4 text-lg font-medium">Nenhum negocio encontrado</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Tente ajustar seus filtros de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
