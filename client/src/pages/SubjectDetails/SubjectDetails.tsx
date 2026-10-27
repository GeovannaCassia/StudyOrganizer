import { BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import NotFound from '@/pages/NotFound/NotFound';

export default function SubjectDetails() {
  const id = Number(useParams().id);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <NotFound
        title="Disciplina não encontrada"
        description="Ela pode ter sido excluída ou o endereço está incorreto."
        backTo="/disciplinas"
        backLabel="Voltar para Disciplinas"
      />
    );
  }

  return (
    <>
      <PageHeader title="Disciplina" />
      {/* Cabeçalho e abas na Fase 5 (F8) */}
      <EmptyState icon={BookOpen} title="Em construção" description="O detalhe da disciplina chega na Fase 5." />
    </>
  );
}
