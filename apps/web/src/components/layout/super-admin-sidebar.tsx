'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Users, Calendar, LayoutDashboard, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/super-admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/super-admin/businesses', icon: Store, label: 'Negocios' },
  { href: '/super-admin/users', icon: Users, label: 'Usuarios' },
  { href: '/super-admin/appointments', icon: Calendar, label: 'Agendamentos' },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center gap-2 px-3 py-3 mb-2">
        <ShieldCheck className="h-5 w-5 text-amber-500" />
        <span className="text-sm font-bold text-amber-500">Super Admin</span>
      </div>
      {navItems.map((item) => {
        const isActive =
          item.href === '/super-admin'
            ? pathname === '/super-admin'
            : pathname.startsWith(item.href) && item.href !== '/super-admin';

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-amber-500 text-white'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border)] bg-[var(--background)] transition-transform md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-[var(--border)] bg-[var(--background)]">
        <NavContent />
      </aside>
    </>
  );
}
