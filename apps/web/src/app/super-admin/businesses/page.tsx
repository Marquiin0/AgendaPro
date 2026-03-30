'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Business {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  isActive: boolean;
  createdAt: string;
  owner: { firstName: string; lastName: string; email: string };
  category: { name: string };
  _count: { services: number; staff: number };
}

interface PaginatedResponse {
  data: Business[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SuperAdminBusinesses() {
  const { data: session } = useSession();
  const [result, setResult] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchData = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);

    const res = await fetch(`${API_URL}/super-admin/businesses?${params}`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }, [session, page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Negocios Cadastrados</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {result?.total || 0} negocios na plataforma
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="outline" className="rounded-full">Buscar</Button>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--muted)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : result?.data.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
            <p className="text-[var(--muted-foreground)]">Nenhum negocio encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Negocio</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Dono</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Cidade</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Servicos</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Equipe</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {result?.data.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{b.name}</td>
                    <td className="py-3 px-4">{b.category.name}</td>
                    <td className="py-3 px-4">
                      <div>{b.owner.firstName} {b.owner.lastName}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{b.owner.email}</div>
                    </td>
                    <td className="py-3 px-4">{b.city || '-'}{b.state ? `, ${b.state}` : ''}</td>
                    <td className="py-3 px-4">{b._count.services}</td>
                    <td className="py-3 px-4">{b._count.staff}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {b.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {new Date(b.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {result?.data.map((b) => (
              <Card key={b.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{b.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {b.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{b.category.name}</p>
                  <p className="text-sm mt-1">Dono: {b.owner.firstName} {b.owner.lastName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{b.city || '-'}{b.state ? `, ${b.state}` : ''}</p>
                  <div className="flex gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
                    <span>{b._count.services} servicos</span>
                    <span>{b._count.staff} profissionais</span>
                    <span>{new Date(b.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {result && result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[var(--muted-foreground)]">
                Pagina {result.page} de {result.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                disabled={page === result.totalPages}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
