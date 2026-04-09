'use client';

import { useState, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { maskPhone, unmaskDigits } from '@/lib/masks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type PasswordStrength = 'fraca' | 'media' | 'forte' | 'muito-forte';

function getPasswordStrength(password: string): { level: PasswordStrength; score: number } {
  if (!password) return { level: 'fraca', score: 0 };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'fraca', score: 1 };
  if (score <= 2) return { level: 'media', score: 2 };
  if (score <= 3) return { level: 'forte', score: 3 };
  return { level: 'muito-forte', score: 4 };
}

const strengthConfig: Record<PasswordStrength, { label: string; color: string; bg: string }> = {
  'fraca': { label: 'Fraca', color: 'bg-red-500', bg: 'text-red-500' },
  'media': { label: 'Média', color: 'bg-yellow-500', bg: 'text-yellow-500' },
  'forte': { label: 'Forte', color: 'bg-blue-500', bg: 'text-blue-500' },
  'muito-forte': { label: 'Muito Forte', color: 'bg-green-500', bg: 'text-green-500' },
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'ADMIN' ? 'ADMIN' : 'CLIENT';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: masked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos e condições');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: unmaskDigits(formData.phone) || undefined,
          password: formData.password,
          role: formData.role,
          acceptTerms: formData.acceptTerms,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login');
        return;
      }

      router.push(formData.role === 'ADMIN' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          {formData.role === 'ADMIN'
            ? 'Cadastre-se como dono de negócio'
            : 'Cadastre-se como cliente'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex rounded-2xl border border-[var(--input)] overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                formData.role === 'CLIENT'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role: 'CLIENT' }))}
            >
              Sou Cliente
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                formData.role === 'ADMIN'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role: 'ADMIN' }))}
            >
              Sou Dono de Negócio
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Seu nome"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Seu sobrenome"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1.5 mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength.score
                          ? strengthConfig[passwordStrength.level].color
                          : 'bg-[var(--muted)]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${strengthConfig[passwordStrength.level].bg}`}>
                  Força: {strengthConfig[passwordStrength.level].label}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita a senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
            )}
          </div>

          <label
            htmlFor="acceptTerms"
            className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 text-sm leading-relaxed cursor-pointer"
          >
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-[var(--muted-foreground)]">
              Eu li e aceito os{' '}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-[var(--primary)] underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                Termos e Condições
              </Link>
              {' '}do AgendaPro.
            </span>
          </label>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          <p className="text-sm text-center text-[var(--muted-foreground)]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[var(--primary)] hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
