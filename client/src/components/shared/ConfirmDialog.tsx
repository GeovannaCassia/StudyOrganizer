import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  /** Chamado ao confirmar; quem usa fecha o diálogo quando a ação terminar. */
  onConfirm: () => void;
  confirmLabel?: string;
  pendingLabel?: string;
  /** true enquanto a ação está em andamento (desabilita os botões). */
  pending?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Excluir',
  pendingLabel = 'Excluindo…',
  pending = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent className="gap-5 rounded-2xl p-6 sm:max-w-[460px]">
        <AlertDialogHeader className="gap-2">
          <AlertDialogMedia className="size-12 rounded-xl bg-danger text-danger-foreground">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] leading-relaxed">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 rounded-b-2xl px-6 py-4">
          <AlertDialogCancel disabled={pending} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            className="h-11 rounded-xl px-5 text-[15px] font-semibold"
            onClick={(event) => {
              // Mantém o diálogo aberto até a ação terminar
              event.preventDefault();
              onConfirm();
            }}
          >
            <Trash2 aria-hidden="true" />
            {pending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
