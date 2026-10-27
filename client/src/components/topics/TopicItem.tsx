import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Topic } from '@/types/topic';

interface TopicItemProps {
  topic: Topic;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Linha da lista de tópicos: caixa de marcar, título, descrição, selo e ações. */
export function TopicItem({ topic, onToggle, onEdit, onDelete }: TopicItemProps) {
  const checkboxId = `topico-${topic.id}`;

  return (
    <li className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
      {/* A área do título também marca a caixa (alvo de toque maior) */}
      <label htmlFor={checkboxId} className="flex min-w-0 flex-1 cursor-pointer items-start gap-3.5">
        <Checkbox
          id={checkboxId}
          checked={topic.isCompleted}
          onCheckedChange={onToggle}
          className="mt-0.5 size-5 rounded-md [&_svg]:size-4"
        />
        <span className="flex min-w-0 flex-col gap-1">
          <span
            className={cn(
              'text-[15px] leading-snug font-medium break-words',
              topic.isCompleted && 'text-muted-foreground line-through decoration-1',
            )}
          >
            {topic.title}
          </span>
          {topic.description && (
            <span className="text-sm leading-normal break-words text-muted-foreground">{topic.description}</span>
          )}
          {/* No celular o selo fica embaixo do título, para sobrar espaço para ele */}
          <StatusBadge status={topic.isCompleted ? 'concluido' : 'pendente'} className="mt-0.5 w-fit sm:hidden" />
        </span>
      </label>

      <StatusBadge status={topic.isCompleted ? 'concluido' : 'pendente'} className="mt-px hidden shrink-0 sm:inline-flex" />

      <div className="-my-1 flex shrink-0 items-center">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={onEdit}
          aria-label={`Editar o tópico ${topic.title}`}
          className="rounded-lg text-muted-foreground"
        >
          <Pencil aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={onDelete}
          aria-label={`Excluir o tópico ${topic.title}`}
          className="rounded-lg text-muted-foreground hover:bg-danger hover:text-danger-foreground"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function TopicItemSkeleton() {
  return (
    <li aria-hidden="true" className="flex items-center gap-3.5 px-4 py-4 sm:px-5">
      <Skeleton className="size-5 rounded-md" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="hidden h-5 w-20 rounded-full sm:block" />
    </li>
  );
}
