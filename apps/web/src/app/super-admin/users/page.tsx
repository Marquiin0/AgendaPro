'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { businesses: number; appointments: number };
}

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  CLIENT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CLIENT: 'Cliente',
};

export default function SuperAdminUsers() {
  const { data: session } = useSession();
  const [result, setResult] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchData = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);

    const res = await fetch(`${API_URL}/super-admin/users?${params}`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }, [session, page, search, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Usuarios</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {result?.total || 0} usuarios na plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm"
        >
          <option value="">Todos os roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CLIENT">Cliente</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <Button onClick={handleSearch} variant="outline" className="rounded-full">Buscar</Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--muted)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : result?.data.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
            <p className="text-[var(--muted-foreground)]">Nenhum usuario encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Telefone</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Negocios</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Agendamentos</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted-foreground)]">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {result?.data.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{u.email}</td>
                    <td className="py-3 px-4">{u.phone || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[u.role] || ''}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u._count.businesses}</td>
                    <td className="py-3 px-4">{u._count.appointments}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {result?.data.map((u) => (
              <Card key={u.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{u.firstName} {u.lastName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[u.role] || ''}`}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{u.email}</p>
                  {u.phone && <p className="text-sm text-[var(--muted-foreground)]">{u.phone}</p>}
                  <div className="flex gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
                    <span>{u._count.businesses} negocios</span>
                    <span>{u._count.appointments} agendamentos</span>
                    <span>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</span>
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
