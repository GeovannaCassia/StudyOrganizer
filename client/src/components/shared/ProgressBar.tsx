import { cn } from '@/lib/utils';

interface ProgressBarProps {
  /** De 0 a 100. */
  value: number;
  /** Nome lido pelo leitor de tela, ex.: "Progresso de Matemática". */
  label: string;
  /** Mostra o % ao lado da barra. */
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, showValue = false, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));
  const done = percent === 100;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-progress-track"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', done ? 'bg-progress-done' : 'bg-progress')}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && (
        <span aria-hidden="true" className="w-10 text-right text-sm font-semibold tabular-nums">
          {percent}%
        </span>
      )}
    </div>
  );
}
