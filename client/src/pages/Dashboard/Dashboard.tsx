import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

function today() {
  const text = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description={today()} />
      {/* Conteúdo na Fase 7 (F12/F13) */}
      <EmptyState icon={LayoutDashboard} title="Em construção" description="Os resumos de estudo chegam na Fase 7." />
    </>
  );
}
