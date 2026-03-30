'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Calendar, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center h-8 w-14 rounded-full bg-[var(--muted)] p-1 transition-colors hover:bg-[var(--muted)]/80"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      <Sun className={cn('h-4 w-4 absolute left-1.5 transition-opacity', isDark ? 'opacity-50' : 'opacity-100 text-yellow-500')} />
      <Moon className={cn('h-4 w-4 absolute right-1.5 transition-opacity', isDark ? 'opacity-100 text-blue-400' : 'opacity-50')} />
      <div
        className={cn(
          'h-6 w-6 rounded-full bg-[var(--background)] shadow-sm transition-transform',
          isDark ? 'translate-x-6' : 'translate-x-0',
        )}
      />
    </button>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardLink = session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)]/40 bg-[var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Calendar className="h-6 w-6 text-[var(--primary)]" />
          <span>AgendaPro</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/businesses" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Explorar
          </Link>
          {session ? (
            <>
              <Link href={dashboardLink} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                Dashboard
              </Link>
              <Link href="/settings" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                Perfil
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 space-y-3">
          <Link href="/businesses" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
            Explorar
          </Link>
          {session ? (
            <>
              <Link href={dashboardLink} className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link href="/settings" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
                Perfil
              </Link>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { signOut(); setMobileOpen(false); }}>
                Sair
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Entrar</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
