# AgendaPro - Plataforma de Agendamento Online

## Sobre o Projeto
AgendaPro é uma plataforma de agendamento online para diversos tipos de negócios (barbearias, clínicas, estúdios, consultorias, academias, spas). Dois tipos de usuário: **ADMIN** (dono do negócio) e **CLIENT** (cliente que agenda serviços).

## Tech Stack
- **Frontend**: Next.js 14+ (App Router) + React + TypeScript
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth (frontend) + JWT (backend)
- **Monorepo**: pnpm workspaces

## Estrutura do Monorepo
```
AgendaPro/
├── apps/
│   ├── web/              # Next.js frontend (porta 3000)
│   └── api/              # NestJS backend (porta 3001)
├── packages/
│   └── database/         # Prisma schema & client compartilhado
├── .github/workflows/
│   └── ci.yml
├── pnpm-workspace.yaml
└── CLAUDE.md
```

## Regras Importantes

### Mobile-First (OBRIGATÓRIO)
- **TODA mudança de UI deve ser responsiva para mobile**
- Usar breakpoints do Tailwind: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Testar em: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px+ (Desktop)
- Navegação mobile: hamburger menu com drawer
- Touch targets: mínimo 44x44px para botões/links
- Time slots no booking: grid touch-friendly

### Convenções de Código
- Componentes React: PascalCase (ex: `BusinessCard.tsx`)
- Funções/variáveis: camelCase
- Arquivos de página Next.js: `page.tsx` (App Router)
- DTOs do NestJS: classe com decorators class-validator
- API prefix: todas as rotas NestJS sob `/api`
- IDs: UUID v4 em todos os models

### Autonomia do Agente
- **Operações de banco de desenvolvimento** (reset, migrate, seed): pode executar sem pedir aval
- **Instalar dependências**: pode executar sem pedir aval
- **Criar/editar arquivos de código**: pode executar sem pedir aval
- **Commits e push para GitHub**: pode executar sem pedir aval
- **Só pedir aval do usuário para**: mudanças arquiteturais muito grandes, deletar funcionalidades existentes, ou operações destrutivas em produção

### Git & CI/CD
- Repositório: https://github.com/Marquiin0/AgendaPro.git
- Branch principal: `main`
- GitHub Actions: lint + type-check + build em cada push
- Sempre verificar se workflows passam após push

### Comandos Úteis
```bash
# Desenvolvimento
pnpm dev                    # Inicia frontend + backend em paralelo
pnpm --filter web dev       # Só frontend
pnpm --filter api start:dev # Só backend

# Database
pnpm db:generate            # Gerar Prisma client
pnpm db:migrate             # Rodar migrations
pnpm db:seed                # Popular dados iniciais
pnpm db:studio              # Abrir Prisma Studio

# Build & Lint
pnpm build                  # Build de tudo
pnpm lint                   # Lint de tudo
pnpm type-check             # Verificar tipos
```

### Variáveis de Ambiente
- `apps/api/.env`: DATABASE_URL, JWT_SECRET, JWT_EXPIRATION, PORT, CORS_ORIGIN
- `apps/web/.env.local`: NEXT_PUBLIC_API_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

### Modelos do Banco (Prisma)
- User (ADMIN | CLIENT)
- BusinessCategory (Barbearia, Clínica, etc.)
- Business (pertence a um ADMIN)
- Service (pertence a um Business)
- Staff (pertence a um Business)
- Schedule (horário semanal recorrente por Staff)
- Appointment (liga Client + Staff + horário)
- AppointmentService (liga Appointment + Service, com snapshot de preço/duração)

### Fluxo de Agendamento
1. Cliente busca negócios por categoria/cidade
2. Seleciona um negócio e vê os serviços
3. Escolhe **múltiplos serviços** (toggle/switch) → funcionário → data → horário disponível
4. Duração e preço total são calculados automaticamente pela soma dos serviços selecionados
5. Confirma agendamento
6. Pode reagendar ou cancelar pelo dashboard
