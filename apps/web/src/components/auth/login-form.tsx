'use client';

import { useEffect, useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const REMEMBER_ME_KEY = 'agendapro.rememberMe';
const REMEMBERED_EMAIL_KEY = 'agendapro.rememberedEmail';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedRememberMe = window.localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    const storedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';

    setRememberMe(storedRememberMe);
    if (storedRememberMe && storedEmail) {
      setEmail(storedEmail);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (rememberMe) {
      window.localStorage.setItem(REMEMBER_ME_KEY, 'true');
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      return;
    }

    window.localStorage.removeItem(REMEMBER_ME_KEY);
    window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }, [email, rememberMe, hydrated]);

  function toggleRememberMe() {
    setRememberMe((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Email ou senha incorretos');
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;

    if (role === 'SUPER_ADMIN') {
      router.push('/super-admin');
    } else if (role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Entre com sua conta para acessar o AgendaPro
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} autoComplete={rememberMe ? 'on' : 'off'}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete={rememberMe ? 'username email' : 'off'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={rememberMe ? 'current-password' : 'off'}
              required
              minLength={6}
            />
          </div>

          <button
            type="button"
            onClick={toggleRememberMe}
            aria-pressed={rememberMe}
            className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]/50"
          >
            <div className="space-y-1 pr-4">
              <p className="text-sm font-medium text-[var(--foreground)]">Lembrar-me</p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                Salva seu email no app e permite que o navegador preencha sua senha com segurança no próximo login.
              </p>
            </div>
            <span
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                rememberMe ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  rememberMe ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </span>
          </button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <p className="text-sm text-center text-[var(--muted-foreground)]">
            Nao tem uma conta?{' '}
            <Link href="/register" className="text-[var(--primary)] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
