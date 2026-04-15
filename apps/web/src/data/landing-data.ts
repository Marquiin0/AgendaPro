export const categories = [
  { icon: 'Scissors', label: 'Barbearias' },
  { icon: 'Stethoscope', label: 'Clinicas' },
  { icon: 'Camera', label: 'Estudios' },
  { icon: 'Briefcase', label: 'Consultorias' },
  { icon: 'Dumbbell', label: 'Academias' },
  { icon: 'Sparkles', label: 'Spas' },
] as const;

export const steps = [
  {
    num: '01',
    title: 'Cadastre seu negocio',
    desc: 'Crie sua conta, escolha sua categoria e adicione as informacoes do seu negocio.',
    icon: 'Store',
  },
  {
    num: '02',
    title: 'Configure servicos e horarios',
    desc: 'Adicione seus servicos, precos, equipe e defina os horarios de atendimento.',
    icon: 'Clock',
  },
  {
    num: '03',
    title: 'Receba agendamentos',
    desc: 'Seus clientes agendam online 24/7. Voce gerencia tudo pelo painel.',
    icon: 'Calendar',
  },
] as const;

export const features = [
  { icon: 'CalendarDays', title: 'Agendamento 24/7', desc: 'Seus clientes agendam a qualquer hora, de qualquer lugar.' },
  { icon: 'ToggleRight', title: 'Multiplos Servicos', desc: 'Combine corte + barba em um unico agendamento com preco e duracao automaticos.' },
  { icon: 'Users', title: 'Gestao de Equipe', desc: 'Controle horarios individuais de cada profissional da sua equipe.' },
  { icon: 'LayoutDashboard', title: 'Painel Administrativo', desc: 'Servicos, equipe, agendamentos e calendario em um so lugar.' },
  { icon: 'CalendarDays', title: 'Calendario Inteligente', desc: 'Visualize sua agenda do dia, semana e mes com cores por status.' },
  { icon: 'ShieldCheck', title: 'Confirmacao Rapida', desc: 'Confirme ou cancele agendamentos com um unico clique.' },
] as const;

export const industries = [
  { icon: 'Scissors', title: 'Barbearias', desc: 'Cortes, barbas e luzes agendados sem dor de cabeca. Seus clientes escolhem o barbeiro e o servico.', color: 'from-blue-500 to-blue-600', image: '/images/Barbearia.png' },
  { icon: 'Stethoscope', title: 'Clinicas', desc: 'Consultas organizadas com horarios definidos por especialidade e profissional.', color: 'from-green-500 to-green-600', image: '/images/Clinica.png' },
  { icon: 'Camera', title: 'Estudios', desc: 'Sessoes de foto, video ou gravacao sem conflitos de agenda entre projetos.', color: 'from-purple-500 to-purple-600', image: '/images/Estudio.png' },
  { icon: 'Briefcase', title: 'Consultorias', desc: 'Reunioes e mentorias agendadas no horario perfeito para ambos os lados.', color: 'from-orange-500 to-orange-600', image: '/images/Consultoria.png' },
  { icon: 'Dumbbell', title: 'Academias', desc: 'Aulas, personal trainers e avaliacoes agendadas com controle total da grade horaria.', color: 'from-sky-500 to-sky-600', image: '/images/Academia.png' },
  { icon: 'Sparkles', title: 'Spas', desc: 'Massagens, tratamentos e terapias organizados com horarios por profissional e sala.', color: 'from-pink-500 to-pink-600', image: '/images/Spa.png' },
] as const;

export const testimonials = [
  { name: 'Rafael Mendes', role: 'Dono', business: 'Barbearia Style', text: 'Desde que comecei a usar o AgendaPro, meus clientes agendam sozinhos e eu nao perco mais tempo no WhatsApp. Meus no-shows cairam pela metade!', rating: 5 },
  { name: 'Dra. Camila Santos', role: 'Diretora', business: 'Clinica Vida', text: 'A organizacao da agenda melhorou demais. Cada medico tem seu horario configurado e os pacientes conseguem agendar online sem ligar pra clinica.', rating: 5 },
  { name: 'Lucas Oliveira', role: 'Fotografo', business: 'Studio LO', text: 'Perfeito pra quem trabalha com sessoes de foto. Consigo configurar duracoes diferentes pra cada tipo de ensaio e tudo fica organizado.', rating: 5 },
] as const;
