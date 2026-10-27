import { BookOpen, Plus } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { DeleteSubjectDialog } from '@/components/subjects/DeleteSubjectDialog';
import { SubjectFormDialog } from '@/components/subjects/SubjectFormDialog';
import { Button } from '@/components/ui/button';
import { useSubjects } from '@/hooks/useSubjects';
import { pluralize } from '@/lib/text';
import type { Subject } from '@/types/subject';
import { SubjectCard, SubjectCardSkeleton } from './SubjectCard';

export default function Subjects() {
  const subjects = useSubjects();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState<Subject | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setFormOpen(true);
  };

  const newButton = (label: string) => (
    <Button size="lg" onClick={openCreate} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
      <Plus aria-hidden="true" className="size-4.5" strokeWidth={2.4} />
      {label}
    </Button>
  );

  const description = subjects.isSuccess
    ? subjects.data.length > 0
      ? pluralize(subjects.data.length, 'disciplina', 'disciplinas')
      : 'Nenhuma disciplina ainda'
    : 'Organize o que você está estudando.';

  return (
    <>
      <PageHeader
        title="Disciplinas"
        description={description}
        actions={subjects.isSuccess && subjects.data.length > 0 && newButton('Nova disciplina')}
      />

      {subjects.isPending && (
        <div role="status" aria-label="Carregando disciplinas" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SubjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {subjects.isError && (
        <ErrorState
          title="Não foi possível carregar as disciplinas."
          message={subjects.error.message}
          onRetry={() => subjects.refetch()}
          retrying={subjects.isFetching}
        />
      )}

      {subjects.isSuccess && subjects.data.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Comece criando sua primeira disciplina"
          description="Organize seus estudos por disciplina e acompanhe o progresso de cada uma."
          action={newButton('Criar primeira disciplina')}
        />
      )}

      {subjects.isSuccess && subjects.data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.data.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={() => openEdit(subject)}
              onDelete={() => setDeleting(subject)}
            />
          ))}
        </div>
      )}

      <SubjectFormDialog open={formOpen} onOpenChange={setFormOpen} subject={editing} />
      {deleting && <DeleteSubjectDialog subject={deleting} onClose={() => setDeleting(null)} />}
    </>
  );
}
