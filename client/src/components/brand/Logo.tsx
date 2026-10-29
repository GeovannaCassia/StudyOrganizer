import { cn } from '@/lib/utils';

// Logo opção A (seção 5.2 do escopo): fundo lavanda chapado, ícone e "Study" em #2E2152, "Organizer" em #3B2A73
// (#5B3FA3, o tom original, dava contraste 4,1:1 sobre o fundo — abaixo do mínimo AA de 4,5:1 para texto pequeno).

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

/** Ícone do app (menu lateral recolhido, favicon). */
export function AppIcon({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Study Organizer"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-lavender-300 text-lavender-900',
        className,
      )}
    >
      <BookIcon className="size-[55%]" />
    </span>
  );
}

/** Logo completo: ícone + "Study Organizer". */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Study Organizer"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-xl bg-lavender-300 px-3 py-2 text-lavender-900',
        className,
      )}
    >
      <BookIcon className="size-6" />
      <span aria-hidden="true" className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight">Study</span>
        <span className="text-[13px] font-semibold text-lavender-800">Organizer</span>
      </span>
    </span>
  );
}
