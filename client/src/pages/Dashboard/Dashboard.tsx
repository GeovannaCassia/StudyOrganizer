import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, CalendarRange, CheckCheck, Clock, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { SubjectFormDialog } from '@/components/subjects/SubjectFormDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessions, useTotalTime } from '@/hooks/useSessions';
import { useSubjects, useSubjectsProgress } from '@/hooks/useSubjects';
import { lastSevenDays, recentSessions, sumTopics, weekMinutes } from '@/lib/dashboard';
import { sessionMinutes } from '@/lib/sessions';
import { pluralize } from '@/lib/text';
import { topicsProgress } from '@/lib/topics';
import { formatDayMonth, formatDuration, formatTime } from '@/lib/time';
import type { Subject } from '@/types/subject';
import { Panel, StatCard } from './DashboardParts';
import { WeekChart } from './WeekChart';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

function today() {
  const text = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const subjects = useSubjects();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description={today()} />

      {subjects.isPending && <DashboardSkeleton />}

      {subjects.isError && (
        <ErrorState
          title="Não foi possível carregar o dashboard."
          message={subjects.error.message}
          onRetry={() => subjects.refetch()}
          retrying={subjects.isFetching}
        />
      )}

      {/* Primeiro acesso (DB5) */}
      {subjects.isSuccess && subjects.data.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Comece criando sua primeira disciplina"
          description="Organize seus estudos por disciplina, marque os tópicos concluídos e registre o tempo estudado."
          action={
            <Button size="lg" onClick={() => setFormOpen(true)} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
              <Plus aria-hidden="true" className="size-4.5" strokeWidth={2.4} />
              Criar primeira disciplina
            </Button>
          }
        />
      )}

      {subjects.isSuccess && subjects.data.length > 0 && <DashboardContent subjects={subjects.data} />}

      <SubjectFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function DashboardContent({ subjects }: { subjects: Subject[] }) {
  const sessions = useSessions();
  const totalTime = useTotalTime();
  const progress = useSubjectsProgress(subjects.map((subject) => subject.id));

  const subjectNames = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject.name])), [subjects]);
  const topics = sumTopics([...progress.byId.values()]);
  const days = useMemo(() => lastSevenDays(sessions.data ?? []), [sessions.data]);
  const recent = useMemo(() => recentSessions(sessions.data ?? []), [sessions.data]);

  return (
    <>
      {/* Cards de resumo (DB1) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Tempo total estudado"
          value={totalTime.isSuccess ? formatDuration(totalTime.data) : totalTime.isError ? '—' : undefined}
          hint="em todas as disciplinas"
        />
        <StatCard
          icon={CalendarRange}
          label="Esta semana"
          value={sessions.isSuccess ? formatDuration(weekMinutes(sessions.data)) : sessions.isError ? '—' : undefined}
          hint="de segunda a domingo"
        />
        <StatCard
          icon={BookOpen}
          label="Disciplinas"
          value={subjects.length}
          hint={<Link to="/disciplinas" className="hover:underline">ver todas</Link>}
        />
        <StatCard
          icon={CheckCheck}
          label="Tópicos concluídos"
          value={progress.isPending ? undefined : `${topics.completed}/${topics.total}`}
          hint={progress.isPending ? undefined : `${Math.round(topicsProgress(topics.completed, topics.total))}% do total`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Gráfico dos últimos 7 dias (DB4) */}
        <Panel
          title="Últimos 7 dias"
          description={sessions.isSuccess ? `Total: ${formatDuration(days.reduce((sum, day) => sum + day.minutes, 0))}` : undefined}
          className="lg:col-span-3"
        >
          {sessions.isPending && <Skeleton className="h-60 w-full" />}
          {sessions.isError && (
            <ErrorState
              title="Não foi possível carregar as sessões."
              message={sessions.error.message}
              onRetry={() => sessions.refetch()}
              retrying={sessions.isFetching}
              className="border-0 py-6"
            />
          )}
          {sessions.isSuccess && <WeekChart days={days} />}
        </Panel>

        {/* Progresso por disciplina (DB2) */}
        <Panel title="Progresso por disciplina" link={{ to: '/disciplinas', label: 'Ver todas' }} className="lg:col-span-2">
          <ul className="-mx-2 flex flex-col">
            {subjects.map((subject) => {
              const subjectProgress = progress.byId.get(subject.id);
              return (
                <li key={subject.id}>
                  <Link
                    to={`/disciplinas/${subject.id}`}
                    className="flex flex-col gap-2 rounded-xl px-2 py-2.5 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="truncate text-[15px] font-medium">{subject.name}</span>
                    {subjectProgress ? (
                      <ProgressBar value={subjectProgress.progress} label={`Progresso de ${subject.name}`} showValue />
                    ) : (
                      <Skeleton className="h-5 w-full rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Sessões recentes (DB3) */}
      <Panel title="Sessões recentes" description="As 5 últimas, de todas as disciplinas">
        {sessions.isPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        )}
        {sessions.isError && <p className="text-sm text-danger-text">Não foi possível carregar as sessões.</p>}
        {sessions.isSuccess && recent.length === 0 && (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-[15px] text-muted-foreground">
            Nenhuma sessão registrada ainda. Abra uma disciplina e use “Registrar sessão”.
          </p>
        )}
        {recent.length > 0 && (
          <ul className="-mx-2 flex flex-col">
            {recent.map((session) => {
              const name = subjectNames.get(session.subjectId) ?? 'Disciplina';
              return (
                <li key={session.id}>
                  <Link
                    to={`/disciplinas/${session.subjectId}?aba=sessoes`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-2.5 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="min-w-0 flex-1 basis-40 truncate text-[15px] font-medium">{name}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatDayMonth(session.startTime)} · {formatTime(session.startTime)}–{formatTime(session.endTime)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground tabular-nums">
                      <Clock aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">Duração:</span>
                      {formatDuration(sessionMinutes(session))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {sessions.isSuccess && sessions.data.length > recent.length && (
          <p className="text-[13px] text-muted-foreground">
            {pluralize(sessions.data.length, 'sessão registrada', 'sessões registradas')} no total.
          </p>
        )}
      </Panel>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Carregando dashboard" className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-[104px] rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-80 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
