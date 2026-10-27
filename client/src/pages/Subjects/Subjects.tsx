import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function Subjects() {
  return (
    <>
      <PageHeader title="Disciplinas" description="Organize o que você está estudando." />
      {/* Lista e CRUD na Fase 4 (F6/F7) */}
      <EmptyState icon={BookOpen} title="Em construção" description="A lista de disciplinas chega na Fase 4." />
    </>
  );
}
