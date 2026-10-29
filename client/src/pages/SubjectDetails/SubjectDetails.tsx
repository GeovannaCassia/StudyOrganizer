import { ArrowLeft, ListChecks, Timer } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ErrorState } from '@/components/shared/ErrorState';
import { DeleteSubjectDialog } from '@/components/subjects/DeleteSubjectDialog';
import { SubjectFormDialog } from '@/components/subjects/SubjectFormDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubject } from '@/hooks/useSubjects';
import NotFound from '@/pages/NotFound/NotFound';
import { isNotFoundError } from '@/services/api';
import { SessionsTab } from './SessionsTab';
import { SubjectHeader, SubjectHeaderSkeleton } from './SubjectHeader';
import { TopicsTab } from './TopicsTab';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

type Tab = 'topicos' | 'sessoes';

function SubjectNotFound() {
  return (
    <NotFound
      title="Disciplina não encontrada"
      description="Ela pode ter sido excluída ou o endereço está incorreto."
      backTo="/disciplinas"
      backLabel="Voltar para Disciplinas"
    />
  );
}

export default function SubjectDetails() {
  const id = Number(useParams().id);
  if (!Number.isInteger(id) || id <= 0) return <SubjectNotFound />;
  // key: trocar de disciplina recomeça o estado da página (janelas abertas, filtro)
  return <SubjectDetailsContent key={id} id={id} />;
}

function SubjectDetailsContent({ id }: { id: number }) {
  const subject = useSubject(id);
  const notFound = subject.isError && isNotFoundError(subject.error);
  useDocumentTitle(notFound ? 'Disciplina não encontrada' : (subject.data?.name ?? 'Disciplina'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // A aba aberta fica na URL (?aba=sessoes); Tópicos é o padrão e não aparece na URL
  const tab: Tab = searchParams.get('aba') === 'sessoes' ? 'sessoes' : 'topicos';
  const changeTab = (value: string) =>
    setSearchParams(value === 'sessoes' ? { aba: 'sessoes' } : {}, { replace: true });

  if (notFound) return <SubjectNotFound />;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/disciplinas"
        className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-lavender-700 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-lavender-300"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Disciplinas
      </Link>

      {subject.isPending && (
        <div role="status" aria-label="Carregando disciplina">
          <SubjectHeaderSkeleton />
        </div>
      )}

      {subject.isError && (
        <ErrorState
          title="Não foi possível carregar a disciplina."
          message={subject.error.message}
          onRetry={() => subject.refetch()}
          retrying={subject.isFetching}
        />
      )}

      {subject.isSuccess && (
        <>
          <SubjectHeader
            subject={subject.data}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />

          <Tabs value={tab} onValueChange={changeTab} className="gap-5">
            <TabsList variant="line" className="h-auto w-full justify-start gap-2 border-b p-0">
              <TabTrigger value="topicos" icon={ListChecks} label="Tópicos" />
              <TabTrigger value="sessoes" icon={Timer} label="Sessões" />
            </TabsList>
            <TabsContent value="topicos">
              <TopicsTab subjectId={id} />
            </TabsContent>
            <TabsContent value="sessoes">
              <SessionsTab subjectId={id} />
            </TabsContent>
          </Tabs>

          <SubjectFormDialog open={editOpen} onOpenChange={setEditOpen} subject={subject.data} />
          {deleteOpen && (
            <DeleteSubjectDialog
              subject={subject.data}
              onClose={() => setDeleteOpen(false)}
              onDeleted={() => navigate('/disciplinas', { replace: true })}
            />
          )}
        </>
      )}
    </div>
  );
}

function TabTrigger({ value, icon: Icon, label }: { value: Tab; icon: typeof ListChecks; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="h-11 flex-none rounded-none px-3 text-[15px] font-semibold text-muted-foreground after:bg-lavender-500 data-active:text-foreground group-data-horizontal/tabs:after:bottom-[-1px]"
    >
      <Icon aria-hidden="true" />
      {label}
    </TabsTrigger>
  );
}
