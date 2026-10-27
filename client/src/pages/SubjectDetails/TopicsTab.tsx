import { ListChecks, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { TopicFormDialog } from '@/components/topics/TopicFormDialog';
import { TopicItem, TopicItemSkeleton } from '@/components/topics/TopicItem';
import { Button } from '@/components/ui/button';
import { useDeleteTopic, useToggleTopic, useTopics } from '@/hooks/useTopics';
import { filterTopics, sortTopics, TOPIC_FILTERS, type TopicFilter } from '@/lib/topics';
import { cn } from '@/lib/utils';
import type { Topic } from '@/types/topic';

const FILTER_LABELS: Record<TopicFilter, string> = {
  todos: 'Todos',
  pendentes: 'Pendentes',
  concluidos: 'Concluídos',
};

const FILTER_EMPTY: Record<TopicFilter, string> = {
  todos: '',
  pendentes: 'Nenhum tópico pendente. Tudo em dia!',
  concluidos: 'Nenhum tópico concluído ainda.',
};

/** Aba Tópicos do detalhe (T1–T4). */
export function TopicsTab({ subjectId }: { subjectId: number }) {
  const topics = useTopics(subjectId);
  const toggleTopic = useToggleTopic(subjectId);
  const deleteTopic = useDeleteTopic(subjectId);

  const [filter, setFilter] = useState<TopicFilter>('todos');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);

  const sorted = useMemo(() => sortTopics(topics.data ?? []), [topics.data]);
  const visible = filterTopics(sorted, filter);
  const completed = sorted.filter((topic) => topic.isCompleted).length;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (topic: Topic) => {
    setEditing(topic);
    setFormOpen(true);
  };

  const newButton = (label: string) => (
    <Button onClick={openCreate} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
      <Plus aria-hidden="true" className="size-4.5" strokeWidth={2.4} />
      {label}
    </Button>
  );

  return (
    <section aria-labelledby="topicos-titulo" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="topicos-titulo" className="text-lg font-semibold">
          Tópicos{' '}
          {topics.isSuccess && (
            <span className="font-normal text-muted-foreground tabular-nums">
              ({completed}/{sorted.length})
            </span>
          )}
        </h2>
        {topics.isSuccess && sorted.length > 0 && newButton('Novo tópico')}
      </div>

      {topics.isSuccess && sorted.length > 0 && (
        <div role="group" aria-label="Filtrar tópicos" className="flex w-fit gap-1 rounded-xl bg-muted p-1">
          {TOPIC_FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={cn(
                'min-h-9 rounded-lg px-3.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
                filter === option && 'bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground',
              )}
            >
              {FILTER_LABELS[option]}
            </button>
          ))}
        </div>
      )}

      {topics.isPending && (
        <ul role="status" aria-label="Carregando tópicos" className="divide-y rounded-2xl border bg-card">
          {Array.from({ length: 4 }, (_, index) => (
            <TopicItemSkeleton key={index} />
          ))}
        </ul>
      )}

      {topics.isError && (
        <ErrorState
          title="Não foi possível carregar os tópicos."
          message={topics.error.message}
          onRetry={() => topics.refetch()}
          retrying={topics.isFetching}
        />
      )}

      {topics.isSuccess && sorted.length === 0 && (
        <EmptyState
          icon={ListChecks}
          title="Adicione os tópicos que você precisa estudar"
          description="Marque cada tópico quando terminar e acompanhe o progresso da disciplina."
          action={newButton('Adicionar tópico')}
        />
      )}

      {topics.isSuccess && sorted.length > 0 && visible.length === 0 && (
        <p className="rounded-2xl border border-dashed px-5 py-8 text-center text-[15px] text-muted-foreground">
          {FILTER_EMPTY[filter]}
        </p>
      )}

      {visible.length > 0 && (
        <ul aria-label="Lista de tópicos" className="divide-y rounded-2xl border bg-card">
          {visible.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onToggle={() => toggleTopic.mutate(topic)}
              onEdit={() => openEdit(topic)}
              onDelete={() => setDeleting(topic)}
            />
          ))}
        </ul>
      )}

      <TopicFormDialog open={formOpen} onOpenChange={setFormOpen} subjectId={subjectId} topic={editing} />

      {deleting && (
        <ConfirmDialog
          open
          onOpenChange={(open) => !open && setDeleting(null)}
          title={`Excluir “${deleting.title}”?`}
          description="Essa ação não pode ser desfeita."
          pending={deleteTopic.isPending}
          onConfirm={() =>
            deleteTopic.mutate(deleting.id, {
              onSuccess: () => {
                toast.success('Tópico excluído');
                setDeleting(null);
              },
            })
          }
        />
      )}
    </section>
  );
}
