import { AppIcon } from '@/components/brand/Logo';

/** Tela cheia exibida enquanto o app verifica a sessão. */
export function LoadingScreen() {
  return (
    <div role="status" className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <AppIcon className="size-14 animate-pulse rounded-2xl" />
      <span className="text-sm text-muted-foreground">Carregando…</span>
    </div>
  );
}
