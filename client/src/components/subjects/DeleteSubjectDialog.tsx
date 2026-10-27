import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useSubjectSessions } from '@/hooks/useSessions';
import { useDeleteSubject, useSubjectProgress } from '@/hooks/useSubjects';
import { cascadeSummary } from '@/lib/text';
import type { Subject } from '@/types/subject';

interface DeleteSubjectDialogProps {
  /** Disciplina a excluir; o diálogo fica aberto enquanto ela estiver definida. */
  subject: Subject;
  onClose: () => void;
  onDeleted?: () => void;
}

/** Confirmação de exclusão (D4), dizendo quantos tópicos e sessões vão junto. */
export function DeleteSubjectDialog({ subject, onClose, onDeleted }: DeleteSubjectDialogProps) {
  const progress = useSubjectProgress(subject.id);
  const sessions = useSubjectSessions(subject.id);
  const deleteSubject = useDeleteSubject();

  const countsReady = progress.isSuccess && sessions.isSuccess;
  const cascade = countsReady ? cascadeSummary(progress.data.totalTopics, sessions.data.length) : null;

  const description = !countsReady ? (
    'Os tópicos e as sessões desta disciplina também serão apagados. Essa ação não pode ser desfeita.'
  ) : cascade ? (
    <>
      Isso também apagará <strong className="text-foreground">{cascade}</strong> desta disciplina. Essa ação não pode
      ser desfeita.
    </>
  ) : (
    'Essa ação não pode ser desfeita.'
  );

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Excluir “${subject.name}”?`}
      description={description}
      pending={deleteSubject.isPending}
      onConfirm={() =>
        deleteSubject.mutate(subject.id, {
          onSuccess: () => {
            toast.success('Disciplina excluída');
            onClose();
            onDeleted?.();
          },
        })
      }
    />
  );
}
