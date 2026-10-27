import { AlertCircle } from 'lucide-react';

/** Erro geral do formulário (ex.: resposta da API), anunciado pelo leitor de tela. */
export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-danger-border bg-danger px-3.5 py-3 text-sm font-medium text-danger-foreground"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}
