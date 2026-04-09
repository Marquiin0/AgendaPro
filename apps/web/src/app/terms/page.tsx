import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Termos e Condições | AgendaPro',
  description: 'Leia os termos e condições de uso da plataforma AgendaPro.',
};

const sections = [
  {
    title: '1. Aceitação dos termos',
    content:
      'Ao criar uma conta ou usar o AgendaPro, você declara que leu, entendeu e concorda com estes Termos e Condições de Uso.',
  },
  {
    title: '2. Uso da plataforma',
    content:
      'O AgendaPro oferece recursos para cadastro de negócios, organização de serviços, horários, equipe e agendamentos online para clientes e administradores.',
  },
  {
    title: '3. Responsabilidades da conta',
    content:
      'Você é responsável por manter seus dados corretos, proteger suas credenciais de acesso e utilizar a plataforma de forma lícita, sem violar direitos de terceiros.',
  },
  {
    title: '4. Dados e privacidade',
    content:
      'Os dados informados na plataforma são utilizados para viabilizar autenticação, agendamentos e operação do serviço. O usuário deve fornecer apenas informações verdadeiras e atualizadas.',
  },
  {
    title: '5. Limites de uso',
    content:
      'Não é permitido usar o AgendaPro para atividades fraudulentas, ilegais, abusivas ou que comprometam a estabilidade, segurança ou disponibilidade da plataforma.',
  },
  {
    title: '6. Alterações nos termos',
    content:
      'O AgendaPro poderá atualizar estes termos periodicamente. Quando isso ocorrer, a versão mais recente ficará disponível nesta página para consulta.',
  },
  {
    title: '7. Contato',
    content:
      'Em caso de dúvidas sobre estes termos, o usuário deverá entrar em contato pelos canais oficiais disponibilizados pela plataforma.',
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[var(--background)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            AgendaPro
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Termos e Condições
            </h1>
            <p className="text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
              Leia com atenção as regras de uso da plataforma. Ao se cadastrar, você confirma que concorda com os termos abaixo.
            </p>
          </div>
        </div>

        <Card className="rounded-3xl border-[var(--border)] shadow-sm">
          <CardContent className="space-y-6 p-5 sm:p-8">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-lg font-semibold sm:text-xl">{section.title}</h2>
                <p className="text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  {section.content}
                </p>
              </section>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/register" className="w-full sm:w-auto">
            <Button className="h-11 w-full rounded-full px-6">Voltar para cadastro</Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="h-11 w-full rounded-full px-6">
              Ir para login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
