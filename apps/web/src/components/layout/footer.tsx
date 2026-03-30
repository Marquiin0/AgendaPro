import { Calendar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Calendar className="h-4 w-4" />
            <span>AgendaPro</span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} AgendaPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
