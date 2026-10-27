import { ArrowRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  /** undefined enquanto carrega. */
  value: ReactNode | undefined;
  hint?: ReactNode;
}

/** Card de resumo do topo (DB1). */
export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {value === undefined ? (
          <Skeleton className="my-1 h-7 w-20" />
        ) : (
          <span className="text-xl font-bold tracking-tight tabular-nums sm:text-2xl">{value}</span>
        )}
        {hint && <span className="text-[13px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

interface PanelProps {
  title: string;
  description?: string;
  /** Link no canto, ex.: "Ver todas" → /disciplinas. */
  link?: { to: string; label: string };
  children: ReactNode;
  className?: string;
}

/** Bloco com título do dashboard (gráfico, progresso, sessões recentes). */
export function Panel({ title, description, link, children, className }: PanelProps) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {link && (
          <Link
            to={link.to}
            className="inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-medium text-lavender-700 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-lavender-300"
          >
            {link.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
