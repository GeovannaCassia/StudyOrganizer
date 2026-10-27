import { Clock, ListChecks, Pencil } from 'lucide-react';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { SubjectActionsMenu } from '@/components/subjects/SubjectActionsMenu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubjectTotalTime } from '@/hooks/useSessions';
import { useSubjectProgress } from '@/hooks/useSubjects';
import { formatDuration } from '@/lib/time';
import type { Subject } from '@/types/subject';

interface SubjectHeaderProps {
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
}

/** Cabeçalho do detalhe (DT1): nome, descrição, progresso, tempo total e ações. */
export function SubjectHeader({ subject, onEdit, onDelete }: SubjectHeaderProps) {
  const progress = useSubjectProgress(subject.id);
  const totalTime = useSubjectTotalTime(subject.id);

  return (
    <header className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight break-words md:text-3xl">{subject.name}</h1>
          {subject.description ? (
            <p className="text-[15px] leading-relaxed break-words text-muted-foreground">{subject.description}</p>
          ) : (
            <p className="text-[15px] text-muted-foreground italic">Sem descrição</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="outline" onClick={onEdit} className="hidden h-10 rounded-xl px-3.5 font-semibold sm:inline-flex">
            <Pencil aria-hidden="true" />
            Editar
          </Button>
          {/* No celular, Editar também fica no menu ⋮ */}
          <SubjectActionsMenu subjectName={subject.name} onEdit={onEdit} onDelete={onDelete} className="sm:hidden" />
          <SubjectActionsMenu subjectName={subject.name} onDelete={onDelete} className="hidden sm:inline-flex" />
        </div>
      </div>

      {progress.isSuccess ? (
        <ProgressBar value={progress.data.progress} label={`Progresso de ${subject.name}`} showValue />
      ) : progress.isPending ? (
        <Skeleton className="h-5 w-full rounded-full" />
      ) : (
        <p className="text-sm text-danger-text">Progresso indisponível</p>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks aria-hidden="true" className="size-4" />
          {progress.isSuccess
            ? `${progress.data.totalTopicsCompleted}/${progress.data.totalTopics} tópicos concluídos`
            : '—'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" />
          {totalTime.isSuccess ? `${formatDuration(totalTime.data)} de estudo` : '—'}
        </span>
      </div>
    </header>
  );
}

export function SubjectHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
