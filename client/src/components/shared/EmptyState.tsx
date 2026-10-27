import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Botão de ação, ex.: "Criar primeira disciplina". */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border bg-card px-6 py-14 text-center',
        className,
      )}
    >
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Icon aria-hidden="true" className="size-8" strokeWidth={1.8} />
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
      {action}
    </section>
  );
}
