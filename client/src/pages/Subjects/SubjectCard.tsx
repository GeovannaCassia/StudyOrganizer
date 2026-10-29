import { Clock, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { SubjectActionsMenu } from '@/components/subjects/SubjectActionsMenu';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubjectTotalTime } from '@/hooks/useSessions';
import { useSubjectProgress } from '@/hooks/useSubjects';
import { formatDate, formatDuration } from '@/lib/time';
import type { Subject } from '@/types/subject';

interface SubjectCardProps {
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const progress = useSubjectProgress(subject.id);
  const totalTime = useSubjectTotalTime(subject.id);

  return (
    <article className="relative flex flex-col gap-3.5 rounded-2xl border bg-card p-5 transition-colors hover:border-lavender-300 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50 dark:hover:border-lavender-700">
      <div className="flex items-start justify-between gap-2">
        <h2 className="min-w-0 pt-2 text-lg leading-snug font-semibold break-words">
          {/* O link cobre o card inteiro; o menu ⋮ fica por cima (z-10) */}
          <Link to={`/disciplinas/${subject.id}`} className="outline-none after:absolute after:inset-0 after:rounded-2xl">
            {subject.name}
          </Link>
        </h2>
        <SubjectActionsMenu subjectName={subject.name} onEdit={onEdit} onDelete={onDelete} className="relative z-10" />
      </div>

      {subject.description ? (
        <p className="line-clamp-2 min-h-[42px] text-sm leading-normal text-muted-foreground">{subject.description}</p>
      ) : (
        <p className="min-h-[42px] text-sm text-muted-foreground italic">Sem descrição</p>
      )}

      {progress.isSuccess ? (
        <ProgressBar value={progress.data.progress} label={`Progresso de ${subject.name}`} showValue />
      ) : progress.isPending ? (
        <Skeleton className="h-5 w-full rounded-full" />
      ) : (
        <p className="text-sm text-danger-text">Progresso indisponível</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks aria-hidden="true" className="size-4" />
          {progress.isSuccess
            ? `${progress.data.totalTopicsCompleted}/${progress.data.totalTopics} tópicos`
            : '—'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" />
          <span className="sr-only">Tempo estudado:</span>
          {totalTime.isSuccess ? formatDuration(totalTime.data) : '—'}
        </span>
      </div>

      <span className="border-t pt-3 text-[13px] text-muted-foreground">Criada em {formatDate(subject.createdAt)}</span>
    </article>
  );
}

export function SubjectCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3.5 rounded-2xl border bg-card p-5">
      <Skeleton className="mt-2 h-6 w-2/3" />
      <Skeleton className="h-[42px] w-full" />
      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-3 h-4 w-1/3" />
    </div>
  );
}
