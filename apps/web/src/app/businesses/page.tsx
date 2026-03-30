import { Store } from 'lucide-react';

export default function BusinessesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Explorar Negocios</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Encontre o servico ideal para voce.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--border)] p-12 text-center">
        <Store className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
        <h3 className="mt-4 text-lg font-medium">Nenhum negocio cadastrado ainda</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Em breve voce podera encontrar negocios aqui.
        </p>
      </div>
    </div>
  );
}
