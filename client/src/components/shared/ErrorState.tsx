import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  /** Mensagem do erro (ex.: a vinda da API). */
  message?: string;
  onRetry?: () => void;
  /** true enquanto a nova tentativa está carregando. */
  retrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Não foi possível carregar os dados.',
  message,
  onRetry,
  retrying = false,
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border border-danger-border bg-card px-6 py-10 text-center',
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-danger text-danger-foreground">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="max-w-md text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="lg" onClick={onRetry} disabled={retrying} className="mt-1 min-h-11 px-4">
          <RotateCw aria-hidden="true" className={cn(retrying && 'animate-spin')} />
          {retrying ? 'Tentando...' : 'Tentar novamente'}
        </Button>
      )}
    </section>
  );
}
