import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS = {
  concluido: { label: 'Concluído', icon: Check, className: 'border-success-border bg-success text-success-foreground' },
  pendente: { label: 'Pendente', icon: Clock, className: 'border-warning-border bg-warning text-warning-foreground' },
} as const;

export type Status = keyof typeof STATUS;

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { label, icon: Icon, className: tone } = STATUS[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tone,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
      {label}
    </span>
  );
}
