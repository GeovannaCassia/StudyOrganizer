import { CalendarClock, CalendarDays, ChevronDown, Clock, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SessionFormDialog } from '@/components/sessions/SessionFormDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteSession, useSubjectSessions, useSubjectTotalTime } from '@/hooks/useSessions';
import { sessionMinutes, sortSessions } from '@/lib/sessions';
import { pluralize } from '@/lib/text';
import { formatDate, formatDayMonth, formatDuration, formatTime } from '@/lib/time';
import type { Session } from '@/types/session';

/** Quantas sessões aparecem por vez (S1: paginação no navegador). */
const PAGE_SIZE = 10;

/** "13/10" no ano atual; "13/10/2025" em outros anos, para não confundir. */
function sessionDay(session: Session): string {
  const sameYear = new Date(session.startTime).getFullYear() === new Date().getFullYear();
  return sameYear ? formatDayMonth(session.startTime) : formatDate(session.startTime);
}

function sessionHours(session: Session): string {
  return `${formatTime(session.startTime)}–${formatTime(session.endTime)}`;
}

/** Aba Sessões do detalhe (S1–S3). */
export function SessionsTab({ subjectId }: { subjectId: number }) {
  const sessions = useSubjectSessions(subjectId);
  const totalTime = useSubjectTotalTime(subjectId);
  const deleteSession = useDeleteSession();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Session | null>(null);

  const sorted = useMemo(() => sortSessions(sessions.data ?? []), [sessions.data]);
  const visible = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visible.length;

  const newButton = (label: string) => (
    <Button onClick={() => setFormOpen(true)} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
      <Plus aria-hidden="true" className="size-4.5" strokeWidth={2.4} />
      {label}
    </Button>
  );

  return (
    <section aria-labelledby="sessoes-titulo" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="sessoes-titulo" className="text-lg font-semibold">
            Sessões{' '}
            {sessions.isSuccess && (
              <span className="font-normal text-muted-foreground tabular-nums">({sorted.length})</span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Total estudado:{' '}
            <strong className="font-semibold text-foreground">
              {totalTime.isSuccess ? formatDuration(totalTime.data) : '—'}
            </strong>
          </p>
        </div>
        {sessions.isSuccess && sorted.length > 0 && newButton('Registrar sessão')}
      </div>

      {sessions.isPending && (
        <ul role="status" aria-label="Carregando sessões" className="divide-y rounded-2xl border bg-card">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} aria-hidden="true" className="flex items-center gap-4 px-4 py-4 sm:px-5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
            </li>
          ))}
        </ul>
      )}

      {sessions.isError && (
        <ErrorState
          title="Não foi possível carregar as sessões."
          message={sessions.error.message}
          onRetry={() => sessions.refetch()}
          retrying={sessions.isFetching}
        />
      )}

      {sessions.isSuccess && sorted.length === 0 && (
        <EmptyState
          icon={CalendarClock}
          title="Nenhuma sessão registrada"
          description="Registre quanto tempo você estudou para acompanhar sua dedicação a esta disciplina."
          action={newButton('Registrar primeira sessão')}
        />
      )}

      {visible.length > 0 && (
        <ul aria-label="Lista de sessões" className="divide-y rounded-2xl border bg-card">
          {visible.map((session) => (
            <li key={session.id} className="flex items-center gap-2.5 py-2.5 pr-2 pl-4 sm:gap-5 sm:px-5">
              <span className="inline-flex w-[4.75rem] shrink-0 items-center gap-2 text-[15px] font-semibold tabular-nums sm:w-28">
                <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
                {sessionDay(session)}
              </span>
              <span className="min-w-0 flex-1 text-[15px] whitespace-nowrap text-muted-foreground tabular-nums">
                <span className="sr-only">das </span>
                {sessionHours(session)}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground tabular-nums">
                <Clock aria-hidden="true" className="size-3.5" />
                <span className="sr-only">Duração:</span>
                {formatDuration(sessionMinutes(session))}
              </span>
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => setDeleting(session)}
                aria-label={`Excluir a sessão de ${sessionDay(session)}, ${sessionHours(session)}`}
                className="shrink-0 rounded-lg text-muted-foreground hover:bg-danger hover:text-danger-foreground"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <Button
          variant="outline"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="h-11 self-center rounded-xl px-5 font-semibold"
        >
          <ChevronDown aria-hidden="true" />
          Ver mais ({pluralize(remaining, 'restante', 'restantes')})
        </Button>
      )}

      <SessionFormDialog open={formOpen} onOpenChange={setFormOpen} subjectId={subjectId} />

      {deleting && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setDeleting(null)}
          title="Excluir sessão?"
          description={
            <>
              A sessão de <strong className="text-foreground">{sessionDay(deleting)}</strong>, das{' '}
              {sessionHours(deleting)} ({formatDuration(sessionMinutes(deleting))}), será apagada. Essa ação
              não pode ser desfeita.
            </>
          }
          pending={deleteSession.isPending}
          onConfirm={() =>
            deleteSession.mutate(deleting.id, {
              onSuccess: () => {
                toast.success('Sessão excluída');
                setDeleting(null);
              },
            })
          }
        />
      )}
    </section>
  );
}
